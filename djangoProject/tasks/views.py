from django.shortcuts import render

# If lists is defined as a "global" variable, values stays there until server restart
LIST_OF_TASKS = ['nákup', 'vysávání', 'zřídit účet']
LIST_OF_SHOPPING_ITEMS = []


# create your views here.
def index(request):
    list_of_tasks = LIST_OF_TASKS

    # If lists are defined as a function variables, values are lost after page refresh
    # list_of_tasks = ['nákup', 'vysávání', 'zřídit účet']
    if request.method == "POST":
        new_task_name = request.POST.get('task_name')
        list_of_tasks.append(new_task_name)

    return render(request, 'tasks.html', {
        'tasks': list_of_tasks
    })


def shopping_lists(request):
    list_of_shopping_items = LIST_OF_SHOPPING_ITEMS

    # If lists are defined as a function variables, values are lost after page refresh
    # list_of_tasks = ['nákup', 'vysávání', 'zřídit účet']
    if request.method == "POST":
        new_shopping_item_name = request.POST.get('shopping_item_name')
        list_of_shopping_items.append(new_shopping_item_name)

    return render(request, 'shopping-lists.html', {
        'shopping_items': list_of_shopping_items
    })