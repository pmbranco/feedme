from rest_framework import viewsets, mixins, status
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response


from feedme.models import Order, OrderLine, Restaurant, Poll, Answer
from feedme.serializers import OrderSerializer, OrderLineSerializer, RestaurantSerializer


class OrderViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (AllowAny,)


class OrderLineViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin,
                       mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = OrderLine.objects.all()
    serializer_class = OrderLineSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    filter_fields = ('id', 'order',)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        print(request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
