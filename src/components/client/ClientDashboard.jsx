import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  useToast,
  Card,
  CardBody,
  Stack,
  Badge,
  VStack,
  HStack,
  Icon,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
} from '@chakra-ui/react';
import { FaBook, FaShoppingCart, FaList } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ClientDashboard = () => {
  const [myBooks, setMyBooks] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    pendingBooks: 0,
    approvedBooks: 0,
    rejectedBooks: 0,
    totalPurchases: 0
  });

  const toast = useToast();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/client/login');
      return;
    }
    fetchMyBooks();
    fetchPurchaseHistory();
    fetchStats();
  }, [token, navigate]);

  const fetchMyBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books/my-books', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyBooks(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to fetch your books',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const fetchPurchaseHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books/purchases', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurchaseHistory(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to fetch purchase history',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books/client-stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to fetch statistics',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'yellow',
      'approved': 'green',
      'rejected': 'red',
      'available': 'green',
      'sold': 'blue'
    };
    return colors[status] || 'gray';
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading mb={2}>Client Dashboard</Heading>
          <Text color="gray.600">Manage your books and view your activity</Text>
        </Box>

        {/* Statistics */}
        <StatGroup bg="white" p={4} borderRadius="lg" boxShadow="sm">
          <Stat>
            <StatLabel>Total Books</StatLabel>
            <StatNumber>{stats.totalBooks}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Pending Review</StatLabel>
            <StatNumber>{stats.pendingBooks}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Approved</StatLabel>
            <StatNumber>{stats.approvedBooks}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Total Purchases</StatLabel>
            <StatNumber>{stats.totalPurchases}</StatNumber>
          </Stat>
        </StatGroup>

        {/* Quick Actions */}
        <HStack spacing={4}>
          <Button
            as={Link}
            to="/sell-book"
            leftIcon={<Icon as={FaBook} />}
            colorScheme="blue"
            size="lg"
          >
            Sell a Book
          </Button>
          <Button
            as={Link}
            to="/books"
            leftIcon={<Icon as={FaShoppingCart} />}
            colorScheme="green"
            size="lg"
          >
            Browse Books
          </Button>
        </HStack>

        {/* Tabs for Books and Purchases */}
        <Tabs colorScheme="blue" variant="enclosed">
          <TabList>
            <Tab>My Books</Tab>
            <Tab>Purchase History</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0} pt={4}>
              <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
                {myBooks.length === 0 ? (
                  <Box p={8} textAlign="center" color="gray.500">
                    You haven't listed any books yet.
                  </Box>
                ) : (
                  myBooks.map((book) => (
                    <Card key={book._id} variant="outline" boxShadow="sm">
                      <CardBody>
                        <Stack spacing={4}>
                          <Heading size="md">{book.title}</Heading>
                          <Text>Author: {book.author}</Text>
                          <Text>Price: ${book.price}</Text>
                          
                          <Box>
                            <Text mb={2}>Stock Status:</Text>
                            <HStack spacing={4}>
                              <Text>Available: {book.quantity}</Text>
                              <Text>Sold: {book.soldQuantity || 0}</Text>
                            </HStack>
                            {book.status === 'available' && (
                              <Progress 
                                value={(book.soldQuantity / (book.quantity + book.soldQuantity)) * 100}
                                colorScheme="green"
                                size="sm"
                                mt={2}
                              />
                            )}
                          </Box>

                          <Text noOfLines={2} color="gray.600">
                            {book.description}
                          </Text>

                          <Badge
                            colorScheme={getStatusColor(book.status)}
                            p={2}
                            borderRadius="md"
                            textAlign="center"
                          >
                            {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                          </Badge>
                        </Stack>
                      </CardBody>
                    </Card>
                  ))
                )}
              </Grid>
            </TabPanel>

            <TabPanel p={0} pt={4}>
              <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
                {purchaseHistory.length === 0 ? (
                  <Box p={8} textAlign="center" color="gray.500">
                    You haven't purchased any books yet.
                  </Box>
                ) : (
                  purchaseHistory.map((purchase) => (
                    <Card key={purchase._id} variant="outline" boxShadow="sm">
                      <CardBody>
                        <Stack spacing={4}>
                          <Heading size="md">{purchase.book.title}</Heading>
                          <Text>Author: {purchase.book.author}</Text>
                          <Text>Quantity: {purchase.quantity}</Text>
                          <Text>Total Price: ${purchase.totalPrice}</Text>
                          <Text>
                            Purchased: {new Date(purchase.purchaseDate).toLocaleDateString()}
                          </Text>
                          <Badge colorScheme="green" p={2} borderRadius="md">
                            Purchased
                          </Badge>
                        </Stack>
                      </CardBody>
                    </Card>
                  ))
                )}
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default ClientDashboard;
