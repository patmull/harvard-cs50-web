import datetime
import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Post, Follower


def index(request):
    return render(request, "network/index.html", {
        'title': "All posts"
    })


def all_posts(request):

    if request.method == "GET":
        try:
            all_posts = Post.objects.all()
            all_posts_ordered = all_posts.order_by('created_at').reverse().all()
        except Post.DoesNotExist:
            return JsonResponse({"error": "Error! Posts couldn't be loaded from database"}, status=400)

        json_response = JsonResponse([post.serialize() for post in all_posts_ordered], safe=False)
        return json_response
    else:
        return JsonResponse({"error": "POST request method requires"}, status=400)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@csrf_exempt
@login_required
def new_post(request):

    print("request:")
    print(request)

    if request.method == "POST":

        post_data = json.loads(request.body)
        new_post_text = post_data.get('post_text')
        new_post_multimedia_link = post_data.get('multimedia_link')
        user_from_request = request.user

        new_post_created = Post(text=new_post_text, multimedia_link=new_post_multimedia_link,
                                created_at=datetime.datetime.now(), user=user_from_request)
        new_post_created.save()

        return JsonResponse({"message": "Email sent successfully"}, status=201)

    return HttpResponseRedirect(reverse('index'))


@csrf_exempt
@login_required()
def follow(request):
    follow_data = json.loads(request.body)
    follow_user_id = follow_data.get('id')

    user_found = User.objects.filter(id=follow_user_id).first()

    new_follower = Follower(user=user_found)
    user_found.followers.append(new_follower)

    return JsonResponse({"message": "Follower was addes succesfully to the user"}, status=201)
