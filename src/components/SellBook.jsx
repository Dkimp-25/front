import { useState } from 'react';
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
  Container,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SellBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/client/login');
      return;
    }

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
        description: 'Book submitted for approval',
        status: 'success',
        duration: 3000,
      });
      // Reset form
      setTitle('');
      setAuthor('');
      setDescription('');
      setPrice('');
      setQuantity('');
      // Navigate to my books
      navigate('/my-books');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to submit book',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading>Sell Your Book</Heading>
        
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Submission Process</AlertTitle>
            <AlertDescription>
              Your book listing will be reviewed by our administrators before being made available for purchase.
              You can check the status of your submission in "My Books".
            </AlertDescription>
          </Box>
        </Alert>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Author</FormLabel>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter book description"
                rows={4}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Price ($)</FormLabel>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                min="0"
                step="0.01"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Quantity</FormLabel>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity available"
                min="1"
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" size="lg" width="100%">
              Submit for Review
            </Button>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default SellBook;
