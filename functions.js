function make_done(card_element) {
    card_element.classList.add("opacity-50")
    let but = card_element.querySelector(".btn")
    but.classList.remove("btn-danger")
    but.classList.add("btn-success")
    let text = card_element.querySelector(".card-title")
    text.classList.add("text-decoration-line-through")
    let contents = card_element.querySelector(".card-text")
    contents.classList.add("text-decoration-line-through")
    let img = card_element.querySelector(".card-img-top")
    img.classList.add("opacity-50")
    but.setAttribute("onclick","make_undone(this.parentElement.parentElement)")
    let user_hash = getCookieValue('user')
    $.get("get_user.php", data={"hash":user_hash}, function(data, status) {
        let uid = data
        $.post("toggle_card.php",data={"card_id":card_element.getAttribute("data-cardid"),
                                       "state":1})
    })
    
}

function make_undone(card_element) {
    card_element.classList.remove("opacity-50")
    let but = card_element.querySelector(".btn")
    but.classList.remove("btn-success")
    but.classList.add("btn-danger")
    let text = card_element.querySelector(".card-title")
    text.classList.remove("text-decoration-line-through")
    let contents = card_element.querySelector(".card-text")
    contents.classList.remove("text-decoration-line-through")
    let img = card_element.querySelector(".card-img-top")
    img.classList.remove("opacity-50")
    but.setAttribute("onclick","make_done(this.parentElement.parentElement)")
    let user_hash = getCookieValue('user')
    $.get("get_user.php", data={"hash":user_hash}, function(data, status) {
        let uid = data
        $.post("toggle_card.php",data={"card_id":card_element.getAttribute("data-cardid"),
                                       "state":0})
    })
}

const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  )

const update_header = (module) => {
    document.getElementById("nav1").classList.remove("active")
    document.getElementById("nav2").classList.remove("active")
    document.getElementById("nav3").classList.remove("active")
    switch (module) {
        case "main":
            document.getElementById("nav1").classList.add("active")
            document.getElementById("nav2").textContent = "Meine Aufgaben"
            document.getElementById("nav3").textContent = "Log out"
            document.getElementById("nav2").setAttribute("onclick", "window.location.hash='#main';refresh()")
            document.getElementById("nav3").href = "/logout.php"
            break
        case "addcard":
            document.getElementById("nav2").textContent = "Meine Aufgaben"
            document.getElementById("nav3").textContent = "Log out"
            document.getElementById("nav2").setAttribute("onclick", "window.location.hash='#main';refresh()")
            document.getElementById("nav3").href = "/logout.php"
            break
        case "login":
            document.getElementById("nav2").classList.add("active")
            document.getElementById("nav2").textContent = "Log in"
            document.getElementById("nav3").textContent = "Sign up"
            document.getElementById("nav2").setAttribute("onclick", "window.location.hash='#login';refresh()")
            document.getElementById("nav3").setAttribute("onclick", "window.location.hash='#signup';refresh()")
            break
        case "signup":
            document.getElementById("nav3").classList.add("active")
            document.getElementById("nav2").textContent = "Log in"
            document.getElementById("nav3").textContent = "Sign up"
            document.getElementById("nav2").setAttribute("onclick", "window.location.hash='#login';refresh()")
            document.getElementById("nav3").setAttribute("onclick", "window.location.hash='#signup';refresh()")
            break
    }
}

const refresh = () => {
    let user_hash = getCookieValue('user')
    let uid
    // Checker for user validity: needs to be run before other data access
    $.ajaxSetup({async: false})
    $.get("get_user.php", data={"hash":user_hash}, function(data, status) {
        uid = data
    })
    $.ajaxSetup({async: true})
    // Default async behaviour restored
    let module;
    let anchor = window.location.hash
    if (anchor.length > 0) {
        module = window.location.hash.replace('#','')
    } else {
        module = "main"
    }
    if ((uid < 1) && (module != "login") && (module != "signup")) {
        window.location.hash = "login"
        module = "login"
        $.get("logout.php")
    }
    update_header(module)
    document.getElementById("main").classList.remove("text-center")
    switch (module) {
        case "main":
            $.get("card_controls.html", function(data, status){
                document.getElementById("main").className = "container-fluid"
                document.getElementById("main").innerHTML = data
                load_cards(user_hash)
            })
            break
        case "login":
            if (uid > 0) {
                window.location.replace('/')
            }
            document.getElementById("main").className = "container-fluid w-50"
            document.getElementById("main").classList.add("text-center")
            $.get("login_base.html", function(data, status){
                document.getElementById("main").innerHTML = data
            })
            break
        case "addcard":
            $.get("add_card.html", function(data, status){
                document.getElementById("main").className = "container-fluid w-50"
                document.getElementById("main").innerHTML = data
            })
            break
        case "signup":
            if (uid > 0) {
                window.location.replace('/')
            }
            $.get("signup_base.html", function(data, status){
                document.getElementById("main").className = "container-fluid w-50"
                document.getElementById("main").classList.add("text-center")
                document.getElementById("main").innerHTML = data
            })
            break
    }
}

const load_cards = (hash) => {
    $.getJSON("/load_cards.php",
              data={hash:hash}, 
              function(data) {
                $.each(data, 
                    function(num,task){
                        let card_div = document.createElement("div")
                        card_div.setAttribute("data-cardid",task.id)
                        card_div.classList.add("card","m-1","shadow")
                        card_div.style = "width: 18rem;"
                        let pic = document.createElement("img")
                        pic.classList.add("card-img-top")
                        pic.src = task.img_path
                        card_div.appendChild(pic)
                        let card_inner_div = document.createElement("div")
                        card_inner_div.classList.add("card-body")
                        card_div.appendChild(card_inner_div)
                        let title = document.createElement("h5")
                        title.classList.add("card-title")
                        title.textContent = task.task
                        card_inner_div.appendChild(title)
                        let text = document.createElement("p")
                        text.classList.add("card-text","text-muted")
                        text.textContent = task.descr
                        card_inner_div.appendChild(text)
                        let toggle_but = document.createElement("a")
                        toggle_but.classList.add("btn","m-1")
                        toggle_but.textContent = "Сделано"
                        card_inner_div.appendChild(toggle_but)
                        let del_but = document.createElement("a")
                        del_but.classList.add("btn","btn-danger","m-1")
                        del_but.textContent = "Удалить"
                        card_inner_div.appendChild(del_but)
                        del_but.setAttribute("onclick","remove_card(this.parentElement.parentElement)")
                        if (task.done == 1) {
                            card_div.classList.add("opacity-50")
                            pic.classList.add("opacity-50")
                            title.classList.add("text-decoration-line-through")
                            text.classList.add("text-decoration-line-through")
                            toggle_but.classList.add("btn-success")
                            toggle_but.textContent = "Не сделано"
                            toggle_but.setAttribute("onclick","make_undone(this.parentElement.parentElement)")
                        }
                        else {
                            toggle_but.classList.add("btn-danger")
                            toggle_but.textContent = "Сделано"
                            toggle_but.setAttribute("onclick","make_done(this.parentElement.parentElement)")
                        }
                        document.getElementById("cards").appendChild(card_div)
                    })
                }
    )
}

const do_login = () => {
    const show_msg = (err_text,good) => {
        let loginform = document.getElementById("loginform")
        let err = document.getElementById("msgbox")
        if (err) {
            loginform.removeChild(err)
        }
        let msgbox = document.createElement("div")
        msgbox.id = "msgbox"
        msgbox.style = "--bs-bg-opacity: .05"
        msgbox.classList.add("border", "rounded-pill", "p-2", "m-2")
        let text = document.createElement("p")
        text.classList.add("m-1")
        text.textContent = err_text
        if (good) {
            msgbox.classList.add("border-success", "bg-success")
            text.classList.add("text-success")
        }
        else {
            msgbox.classList.add("border-danger", "bg-danger")
            text.classList.add("text-danger")
        }
        msgbox.appendChild(text)
        loginform.prepend(msgbox)
    }
    let login = document.getElementById("login").value
    let pass = document.getElementById("password").value
    if (pass.length == 0) {
        show_msg("No password provided",false)
        return false;
    }
    if (login.length == 0) {
        show_msg("No login provided",false)
        return false;
    }
    $.post("/login.php",data={"login":login,"password":pass}).then( resp => {
        if (resp == 1) {
            show_msg("Wrong login or password",false)
            return false
        }
        else if (resp == 0) {
            show_msg("Logged in successfully! Redirecting to main page...",true)
            window.location.replace('/')
            return false
        }
    })
    return false
}

const do_register = () => {
    const show_msg = (err_text,good) => {
        let regform = document.getElementById("regform")
        let err = document.getElementById("msgbox")
        if (err) {
            regform.removeChild(err)
        }
        let msgbox = document.createElement("div")
        msgbox.id = "msgbox"
        msgbox.style = "--bs-bg-opacity: .05"
        msgbox.classList.add("border", "rounded-pill", "p-2", "m-2")
        let text = document.createElement("p")
        text.classList.add("m-1")
        text.textContent = err_text
        if (good) {
            msgbox.classList.add("border-success", "bg-success")
            text.classList.add("text-success")
        }
        else {
            msgbox.classList.add("border-danger", "bg-danger")
            text.classList.add("text-danger")
        }
        msgbox.appendChild(text)
        regform.prepend(msgbox)
    }
    let login = document.getElementById("login").value
    let pass = document.getElementById("password").value
    if (pass.length == 0) {
        show_msg("No password provided",false)
        return false;
    }
    if (login.length == 0) {
        show_msg("No login provided",false)
        return false;
    }
    $.post("/signup.php",data={"login":login,"password":pass}).then( resp => {
        if (resp == 1) {
            show_msg("User with this name already exists",false)
            return false
        }
        else if (resp == 0) {
            show_msg("Registered in successfully! Redirecting to main page...",true)
            window.location.replace('/')
            return false
        }
    })
    return false
}

const add_card = () => {
    const show_msg = (err_text,good) => {
        let cardform = document.getElementById("addcardform")
        let err = document.getElementById("msgbox")
        if (err) {
            cardform.removeChild(err)
        }
        let msgbox = document.createElement("div")
        msgbox.id = "msgbox"
        msgbox.style = "--bs-bg-opacity: .05"
        msgbox.classList.add("border", "rounded-pill", "p-2", "m-2", "text-center")
        let text = document.createElement("p")
        text.classList.add("m-1")
        text.textContent = err_text
        if (good) {
            msgbox.classList.add("border-success", "bg-success")
            text.classList.add("text-success")
        }
        else {
            msgbox.classList.add("border-danger", "bg-danger")
            text.classList.add("text-danger")
        }
        msgbox.appendChild(text)
        cardform.prepend(msgbox)
    }
    let name = document.getElementById("name").value
    let descr = document.getElementById("description").value
    let img = document.getElementById("imgfile").value
    if (name.length == 0) {
        show_msg("Name can't be empty",false)
        return false
    }
    $.ajax({
        type: 'POST',
        url:"add_card.php",
        data: new FormData($("#addcardform")[0]),
        processData: false, 
        contentType: false, 
        success: res => { show_msg("Card added!",true) }
    })
    return false
}

const remove_card = (card) => {
    let card_id = card.getAttribute("data-cardid")
    $.post("/del_card.php",data={'card_id':card_id})
    card.parentElement.removeChild(card)
}