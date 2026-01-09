import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Card, Paragraph} from 'react-native-paper';
import Icon from '../../../components/Icons/Icon';

const CountdownTimer = ({targetDate}) => {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return {timeLeft, difference};
  };

  const [time, setTime] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (time.difference <= 0) {
    return (
      <Paragraph style={{color: 'green', fontWeight: 'bold', marginTop: 4}}>
        <Icon.FontAwesome name="clock-o" size={16} /> Arriving soon
      </Paragraph>
    );
  }

  return (
    <Paragraph style={{color: 'green', fontWeight: 'bold', marginTop: 4}}>
      <Icon.FontAwesome name="clock-o" size={16} /> Arriving in{' '}
      {time.timeLeft.minutes}m {time.timeLeft.seconds}s
    </Paragraph>
  );
};

const OrderItem = ({order}) => {
  const getStatusColor = status => {
    switch (status) {
      case 'Pending':
        return '#FFA500'; // Orange
      case 'Processing':
        return '#0000FF'; // Blue
      case 'Shipped':
        return '#1E90FF'; // Dodger Blue
      case 'Delivered':
        return '#32CD32'; // Lime Green
      case 'Cancelled':
        return '#FF0000'; // Red
      default:
        return '#000000'; // Black
    }
  };

  return (
    <Card style={styles.orderContainer}>
      <Card.Content>
        <Paragraph style={styles.orderId}>
          <Icon.FontAwesome name="barcode" size={16} /> Order ID:{' '}
          {order.orderId}
        </Paragraph>
        <Paragraph style={styles.orderDate}>
          <Icon.FontAwesome name="calendar" size={16} />{' '}
          <Text style={{fontWeight: 'bold'}}>Date:</Text>{' '}
          {(() => {
            const d = new Date(order.createdAt);
            const months = [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ];
            const dateStr = `${d.getDate().toString().padStart(2, '0')} ${
              months[d.getMonth()]
            } ${d.getFullYear()}`;
            let hours = d.getHours();
            const minutes = d.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            const timeStr = `${hours}:${minutes} ${ampm}`;
            return `${dateStr} | ${timeStr}`;
          })()}
        </Paragraph>
        {order.vendors.map(vendorItem => (
          <View key={vendorItem.vendor._id} style={styles.vendorContainer}>
            <Paragraph style={styles.vendorName}>
              <Icon.FontAwesome name="user" size={16} /> Vendor Name:{' '}
              {vendorItem.vendor.name}
            </Paragraph>
            <Paragraph
              style={[
                styles.orderStatus,
                {
                  color: getStatusColor(vendorItem.orderStatus),
                  fontWeight: 'bold',
                },
              ]}>
              <Icon.FontAwesome name="info-circle" size={16} /> Order Status:{' '}
              {vendorItem.orderStatus}
            </Paragraph>
            {vendorItem.orderStatus === 'Processing' &&
              vendorItem.estimatedDeliveryDate && (
                <CountdownTimer targetDate={vendorItem.estimatedDeliveryDate} />
              )}

            {vendorItem.products.map(productItem => (
              <View key={productItem._id} style={styles.productContainer}>
                <Paragraph style={styles.productName}>
                  <Icon.FontAwesome name="cube" size={16} /> Product:{' '}
                  {productItem.product
                    ? productItem.product.name
                    : 'Product Unavailable'}
                </Paragraph>
                <Paragraph style={styles.productDetails}>
                  <Icon.FontAwesome name="sort-numeric-asc" size={16} />{' '}
                  Quantity: {productItem.quantity}
                </Paragraph>
                <Paragraph style={styles.productDetails}>
                  <Icon.FontAwesome name="dollar" size={16} /> Price: ₹
                  {productItem.price}
                </Paragraph>
                <Paragraph style={styles.productDetails}>
                  <Icon.FontAwesome name="percent" size={16} /> Discount:{' '}
                  {productItem.discount}%
                </Paragraph>
                <Paragraph style={styles.productDetails}>
                  <Icon.FontAwesome name="calculator" size={16} /> Total Amount:
                  ₹{productItem.totalAmount.toFixed(2)}
                </Paragraph>
              </View>
            ))}
          </View>
        ))}
        <View style={styles.shippingContainer}>
          <Paragraph style={styles.shippingTitle}>
            <Icon.FontAwesome name="truck" size={16} /> Shipping Address:
          </Paragraph>
          <Paragraph style={styles.shippingDetails}>
            <Icon.FontAwesome name="map-marker" size={16} />{' '}
            {order.shippingAddress.address}
          </Paragraph>
          <Paragraph style={styles.shippingDetails}>
            {order.shippingAddress.city}, {order.shippingAddress.state}
          </Paragraph>
          <Paragraph style={styles.shippingDetails}>
            {order.shippingAddress.country} - {order.shippingAddress.postalCode}
          </Paragraph>
        </View>
      </Card.Content>
    </Card>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  orderContainer: {
    marginHorizontal: 15,
    marginVertical: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  vendorContainer: {
    marginBottom: 8,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productContainer: {
    marginLeft: 16,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  productDetails: {
    fontSize: 14,
    color: '#666',
  },
  shippingContainer: {
    marginTop: 16,
  },
  shippingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  shippingDetails: {
    fontSize: 14,
    color: '#666',
  },
});
