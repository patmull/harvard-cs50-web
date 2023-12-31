from django.urls import path

from tasks import views

app_name = 'tasks'
urlpatterns = [
    path('', views.index, name='index'),
    path('shopping-lists', views.shopping_lists, name='shopping_lists'),
    path('new-task', views.index, name='new_task'),
    path('new-shopping-item',  views.shopping_lists, name='add_new_shopping_item')
]
