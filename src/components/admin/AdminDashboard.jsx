import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  useToast,
  Grid,
  Text,
  Card,
  CardBody,
  Stack,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Divider,
  HStack,
  Progress,
  ButtonGroup,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [books, setBooks] = useState([]);
  const [pendingBooks, setPendingBooks] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    soldBooks: 0,
    outOfStock: 0,
    pendingBooks: 0,
    totalQuantity: 0,
    totalSoldQuantity: 0
  });
  
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || localStorage.getItem('role') !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchBooks();
    fetchPendingBooks();
    fetchStatistics();
  }, [token, navigate]);

  const fetchPendingBooks = async () => {
    try {
      const response = await axios.get('https://back-production-9b4c.up.railway.app/api/books/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingBooks(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch pending books',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleBookReview = async (bookId, action) => {
    try {
      await axios.patch(
        `https://back-production-9b4c.up.railway.app/api/books/${bookId}/review`,
        { action },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: 'Success',
        description: `Book ${action}d successfully`,
        status: 'success',
        duration: 3000,
      });
      // Refresh all data
      fetchBooks();
      fetchPendingBooks();
      fetchStatistics();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || `Failed to ${action} book`,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('https://back-production-9b4c.up.railway.app/api/books/statistics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch statistics',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get('https://back-production-9b4c.up.railway.app/api/books/available');
      setBooks(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch books',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'https://back-production-9b4c.up.railway.app/api/books',
        {
          title,
          author,
          description,
          price: Number(price),
          quantity: Number(quantity),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: 'Success',
        description: 'Book added successfully',
        status: 'success',
        duration: 3000,
      });
      // Reset form
      setTitle('');
      setAuthor('');
      setDescription('');
      setPrice('');
      setQuantity('');
      // Refresh data
      fetchBooks();
      fetchStatistics();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to add book',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        {/* Statistics */}
        <Box>
          <Heading mb={6}>Dashboard Statistics</Heading>
          <StatGroup mb={6}>
            <Stat>
              <StatLabel>Total Books</StatLabel>
              <StatNumber>{stats.totalBooks}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Available Books</StatLabel>
              <StatNumber>{stats.availableBooks}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Pending Review</StatLabel>
              <StatNumber>{stats.pendingBooks}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Sold Books</StatLabel>
              <StatNumber>{stats.soldBooks}</StatNumber>
            </Stat>
          </StatGroup>

          {/* Sales Statistics */}
          <Box p={4} borderWidth={1} borderRadius="lg" mb={4}>
            <Heading size="md" mb={4}>Sales Overview</Heading>
            <Stack spacing={4}>
              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text>Total Inventory</Text>
                  <Text>{stats.totalQuantity + stats.totalSoldQuantity} units</Text>
                </HStack>
                <HStack justify="space-between" mb={2}>
                  <Text>Available Stock</Text>
                  <Text>{stats.totalQuantity} units</Text>
                </HStack>
                <HStack justify="space-between" mb={2}>
                  <Text>Total Sold</Text>
                  <Text>{stats.totalSoldQuantity} units</Text>
                </HStack>
                <Progress 
                  value={(stats.totalSoldQuantity / (stats.totalQuantity + stats.totalSoldQuantity)) * 100}
                  colorScheme="green"
                  hasStripe
                />
              </Box>
            </Stack>
          </Box>
        </Box>

        <Divider />

        {/* Tabs for different sections */}
        <Tabs>
          <TabList>
            <Tab>Add New Book</Tab>
            <Tab>Pending Approvals ({pendingBooks.length})</Tab>
            <Tab>Available Books</Tab>
          </TabList>

          <TabPanels>
            {/* Add Book Form */}
            <TabPanel>
              <Box>
                <Heading size="md" mb={6}>Add New Book</Heading>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="stretch" maxW="md">
                    <FormControl isRequired>
                      <FormLabel>Title</FormLabel>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Author</FormLabel>
                      <Input
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Price ($)</FormLabel>
                      <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Quantity</FormLabel>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </FormControl>
                    <Button type="submit" colorScheme="blue" width="100%">
                      Add Book
                    </Button>
                  </VStack>
                </form>
              </Box>
            </TabPanel>

            {/* Pending Books */}
            <TabPanel>
              <Box>
                <Heading size="md" mb={6}>Pending Approvals</Heading>
                <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
                  {pendingBooks.map((book) => (
                    <Card key={book._id}>
                      <CardBody>
                        <Stack spacing={3}>
                          <Heading size="md">{book.title}</Heading>
                          <Text>Author: {book.author}</Text>
                          <Text>Price: ${book.price}</Text>
                          <Text>Quantity: {book.quantity}</Text>
                          <Text>Seller: {book.seller.username}</Text>
                          <Text noOfLines={2}>{book.description}</Text>
                          <Badge colorScheme="yellow">Pending Review</Badge>
                          <ButtonGroup spacing={4} width="100%">
                            <Button
                              colorScheme="green"
                              onClick={() => handleBookReview(book._id, 'approve')}
                              flex={1}
                            >
                              Approve
                            </Button>
                            <Button
                              colorScheme="red"
                              onClick={() => handleBookReview(book._id, 'reject')}
                              flex={1}
                            >
                              Reject
                            </Button>
                          </ButtonGroup>
                        </Stack>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
              </Box>
            </TabPanel>

            {/* Available Books */}
            <TabPanel>
              <Box>
                <Heading size="md" mb={6}>Available Books</Heading>
                <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
                  {books.map((book) => (
                    <Card key={book._id}>
                      <CardBody>
                        <Stack spacing={3}>
                          <Heading size="md">{book.title}</Heading>
                          <Text>Author: {book.author}</Text>
                          <Text>Price: ${book.price}</Text>
                          <Box>
                            <Text>Stock Status:</Text>
                            <HStack spacing={4}>
                              <Text>Available: {book.quantity}</Text>
                              <Text>Sold: {book.soldQuantity}</Text>
                            </HStack>
                            <Progress 
                              value={(book.soldQuantity / (book.quantity + book.soldQuantity)) * 100}
                              colorScheme="green"
                              size="sm"
                              mt={2}
                            />
                          </Box>
                          <Text noOfLines={2}>{book.description}</Text>
                          <Badge colorScheme={book.quantity > 0 ? "green" : "red"}>
                            {book.quantity > 0 ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </Stack>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default AdminDashboard;
