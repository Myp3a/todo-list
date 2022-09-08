import datetime
from django.shortcuts import redirect, render
from django.http import HttpResponse, HttpResponseBadRequest
from .models import Task, User
from .forms import NewCardForm
import hashlib
from os.path import exists as file_exists
import os
from . import config

def verify_user(func):
    def verify_cookie(*args, **kwargs):
        request = args[0]
        user_hash = request.COOKIES.get("user")
        if user_hash is None:
            return redirect('/auth')
        if not User.objects.filter(hash=user_hash):
            return render(request, 'login.html', {"msg":"Bad user token", "err": True})
        return func(*args, **kwargs)
    return verify_cookie

@verify_user
def index(request):
    user_hash = request.COOKIES.get("user")
    user = User.objects.filter(hash=user_hash)[0]
    tasks = Task.objects.filter(user_id=user.id)
    data = {
        "tasks_list": tasks
    }
    return render(request, 'index.html', data)  

def auth(request):
    if request.POST:
        login = request.POST["login"]
        password = request.POST["password"]
        hash = hashlib.sha256((login+password).encode()).hexdigest()
        found = False
        if User.objects.filter(hash=hash):
            found = True
        if not found:
            return render(request, 'login.html', {"msg":"Wrong username or password", "err": True})
        #resp = redirect("/")
        resp = render(request, 'login.html', {"msg":"Logged in successfully! Redirecting to main page...", "err": False})
        resp.set_cookie('user', hash, max_age=86400)
        return resp
    else:
        return render(request, 'login.html', {})

def reg(request):
    if request.POST:
        login = request.POST["login"]
        password = request.POST["password"]
        hash = hashlib.sha256((login+password).encode()).hexdigest()
        found = False
        if User.objects.filter(hash=hash):
            found = True
        if found:
            return render(request, 'register.html', {"msg":"This data already exists", "err": True})
        User.objects.create(
            login=login,
            password=password,
            hash=hash
        )
        resp = render(request, 'register.html', {"msg":"Registered successfully! Redirecting to main page...", "err": False})
        resp.set_cookie('user', hash, max_age=86400)
        return resp
    return render(request, 'register.html', {})

@verify_user
def detail(request, id):
    user_hash = request.COOKIES.get("user")
    user = User.objects.filter(hash=user_hash)[0]
    task = Task.objects.filter(id=id,user=user)
    if not task:
        return redirect('/')
    return render(request, 'card.html', {"task": task[0]})

@verify_user
def add(request):
    user_hash = request.COOKIES.get("user")
    if request.POST:
        form = NewCardForm(request.POST, request.FILES)
        if not form.is_valid():
            return render(request, 'newcard.html', {"err": True, "msg": "Name and description are required"})
        print(form.cleaned_data)
        if (img_path := form.cleaned_data["imgfile"]) is None:
            img_path = "dickcat-kel.jpg"
        else:
            ext = "." + request.FILES["imgfile"].name.split(".")[-1]
            file = request.FILES["imgfile"].read()
            fhash = hashlib.md5(file).hexdigest()
            prefix = f"{config.PATH}/todo/static/"
            img_path = f"task_img/{fhash}{ext}"
            if file_exists(prefix + f"task_img/{fhash}{ext}"):
                print("already here")
                pass
            else:
                with open(prefix + f"task_img/{fhash}{ext}", 'wb') as outf:
                    outf.write(file)
        Task.objects.create(
            user=User.objects.filter(hash=user_hash)[0],
            task=form.cleaned_data["name"],
            descr=form.cleaned_data["description"],
            img_path=img_path,
            due_to=form.cleaned_data["due_to"])
        return redirect("/")
    else:
        return render(request, 'newcard.html', {})

def logout(request):
    resp = redirect("/auth")
    user_hash = request.COOKIES.get("user")
    if not user_hash is None:
        resp.delete_cookie("user")
    return resp

@verify_user
def delete(request):
    user_hash = request.COOKIES.get("user")
    if request.POST:
        user = User.objects.filter(hash=user_hash)[0]
        task = Task.objects.filter(id=request.POST["card_id"],user=user)
        if task:
            task.delete()
            return HttpResponse("ok")
        else:
            return HttpResponse("fail")
    else:
        return redirect("/")

@verify_user
def toggle(request):
    user_hash = request.COOKIES.get("user")
    if request.POST:
        user = User.objects.filter(hash=user_hash)[0]
        task = Task.objects.filter(id=request.POST["card_id"],user=user)
        if task:
            task = task[0]
            if task.done:
                task.done = False
            else:
                task.done = True
            task.save()
            return HttpResponse("ok")
        else:
            return HttpResponse("fail")
    else:
        return redirect("/")

@verify_user
def schedule(request):
    user_hash = request.COOKIES.get("user")
    if request.POST:
        user = User.objects.filter(hash=user_hash)[0]
        task = Task.objects.filter(id=request.POST["card_id"],user=user)
        if task:
            task = task[0]
            try:
                task.due_to = datetime.datetime.fromtimestamp(int(request.POST["time"]))
            except:
                return HttpResponseBadRequest("invalid ts")
            task.save()
            return HttpResponse("ok")
        else:
            return HttpResponse("fail")
    else:
        return redirect("/")