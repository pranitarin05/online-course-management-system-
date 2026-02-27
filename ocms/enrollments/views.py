# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from .models import Enrollment
from .serializers import EnrollmentSerializer
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator


@api_view(['GET','POST'])
@cache_page(60)
@permission_classes([IsAuthenticated])
def enrollment_list(request):

    if request.method == 'GET':
        enrollments = Enrollment.objects.all()

        paginator = PageNumberPagination()
        paginator.page_size = 2
        paginated = paginator.paginate_queryset(enrollments, request)

        serializer = EnrollmentSerializer(paginated, many=True)
        return paginator.get_paginated_response(serializer.data)

    if request.method == 'POST':
        serializer = EnrollmentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)


@api_view(['GET','PUT','PATCH','DELETE'])
@cache_page(60)
@permission_classes([IsAuthenticated])
def enrollment_detail(request, id):
    try:
        enrollment = Enrollment.objects.get(id=id)
    except Enrollment.DoesNotExist:
        return Response({'error':'Not found'}, status=404)

    if request.method == 'GET':
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = EnrollmentSerializer(enrollment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

    if request.method == 'PATCH':
        serializer = EnrollmentSerializer(enrollment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

    if request.method == 'DELETE':
        enrollment.delete()
        return Response({'message':'deleted'}, status=204)
