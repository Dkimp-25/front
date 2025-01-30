import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  useToast,
  Card,
  CardBody,
  Stack,
  Badge,
  Container,
  VStack,
  HStack,
  Progress,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/client/login');
      return;
    }
    fetchMyBooks();
  }, [token, navigate]);

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

  const fetchMyBooks = async () => {
    try {
      const response = await axios.get('https://back-production-9b4c.up.railway.app/api/books/my-books', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to fetch your books',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading mb={2}>My Books</Heading>
          <Text color="gray.600">Manage and track your book listings</Text>
        </Box>

        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
          {books.length === 0 ? (
            <Box p={8} textAlign="center" color="gray.500">
              You haven't listed any books yet.
            </Box>
          ) : (
            books.map((book) => (
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
      </VStack>
    </Container>
  );
};

export default MyBooks;
