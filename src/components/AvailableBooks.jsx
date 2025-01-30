import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Text,
  useToast,
  Card,
  CardBody,
  Stack,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AvailableBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});
  const toast = useToast();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books/available');
      setBooks(response.data);
      const initialQuantities = {};
      response.data.forEach(book => {
        initialQuantities[book._id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to fetch books',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handlePurchase = async (bookId) => {
    if (!token) {
      navigate('/client/login');
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5000/api/books/${bookId}/buy`,
        { quantity: quantities[bookId] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: 'Success',
        description: 'Book purchased successfully',
        status: 'success',
        duration: 3000,
      });
      fetchBooks();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to purchase book',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleQuantityChange = (bookId, value) => {
    setQuantities(prev => ({
      ...prev,
      [bookId]: parseInt(value)
    }));
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading mb={2}>Available Books</Heading>
          <Text color="gray.600">Browse our collection of books</Text>
        </Box>

        <InputGroup maxW="md">
          <InputLeftElement pointerEvents="none">
            <Icon as={FaSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderRadius="full"
          />
        </InputGroup>

        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
          {filteredBooks.length === 0 ? (
            <Box p={8} textAlign="center" color="gray.500">
              No books found.
            </Box>
          ) : (
            filteredBooks.map((book) => (
              <Card key={book._id} variant="outline" boxShadow="sm">
                <CardBody>
                  <Stack spacing={4}>
                    <Heading size="md">{book.title}</Heading>
                    <Text>Author: {book.author}</Text>
                    <Text>Price: ${book.price}</Text>
                    <Text noOfLines={2} color="gray.600">
                      {book.description}
                    </Text>
                    <HStack justify="space-between" align="center">
                      <Badge
                        colorScheme={book.quantity > 0 ? 'green' : 'red'}
                        p={2}
                        borderRadius="md"
                      >
                        {book.quantity > 0 ? `${book.quantity} in stock` : 'Out of stock'}
                      </Badge>
                      {book.quantity > 0 && (
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Icon as={FaShoppingCart} />
                          </InputLeftElement>
                          <Input
                            type="number"
                            value={quantities[book._id]}
                            onChange={(e) => handleQuantityChange(book._id, e.target.value)}
                            min={1}
                            max={book.quantity}
                          />
                        </InputGroup>
                      )}
                      <Button
                        rightIcon={<Icon as={FaShoppingCart} />}
                        colorScheme="blue"
                        size="sm"
                        onClick={() => handlePurchase(book._id)}
                        isDisabled={book.quantity === 0}
                      >
                        Buy
                      </Button>
                    </HStack>
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

export default AvailableBooks;
