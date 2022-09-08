from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('auth', views.auth, name="auth"),
    path('reg', views.reg, name="reg"),
    path('task/<int:id>', views.detail, name='taskdata'),
    path('add', views.add, name="add"),
    path('logout', views.logout, name="logout"),
    path('delete', views.delete, name="delete"),
    path('toggle', views.toggle, name="toggle"),
    path('schedule', views.schedule, name="schedule")
]
