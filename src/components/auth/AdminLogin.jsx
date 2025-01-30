import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  Icon,
  Flex,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const bgGradient = useColorModeValue(
    'linear(to-br, purple.50, white)',
    'linear(to-br, purple.900, gray.800)'
  );

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('https://back-production-9b4c.up.railway.app/api/auth/admin/login', {
        email: formData.email,
        password: formData.password
      });

      // Store token and role in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', 'admin');

      toast({
        title: 'Login Successful',
        description: 'Welcome, Admin!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error.response?.data?.error || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex 
      minH="100vh" 
      bgGradient={bgGradient}
      align="center" 
      justify="center" 
      py={12}
    >
      <Container 
        maxW="md" 
        bg={useColorModeValue('white', 'gray.700')} 
        p={8} 
        borderRadius="xl" 
        boxShadow="2xl"
      >
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading 
              mb={4} 
              bgGradient="linear(to-r, purple.400, purple.600)"
              bgClip="text"
            >
              Admin Login
            </Heading>
            <Text color="gray.500">Access the DK Book Stall admin portal</Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              {/* Email */}
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>
                  <Flex align="center">
                    <Icon as={FaEnvelope} mr={2} color="purple.500" />
                    Email
                  </Flex>
                </FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your admin email"
                  variant="filled"
                  focusBorderColor="purple.500"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              {/* Password */}
              <FormControl isInvalid={!!errors.password}>
                <FormLabel>
                  <Flex align="center">
                    <Icon as={FaLock} mr={2} color="purple.500" />
                    Password
                  </Flex>
                </FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your admin password"
                    variant="filled"
                    focusBorderColor="purple.500"
                  />
                  <InputRightElement>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Icon as={showPassword ? FaEyeSlash : FaEye} />
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              {/* Forgot Password Link */}
              <Flex justifyContent="flex-end" w="full">
                <Button 
                  variant="link" 
                  color="purple.500" 
                  size="sm"
                  onClick={() => {/* TODO: Implement forgot password */}}
                >
                  Forgot Password?
                </Button>
              </Flex>

              {/* Submit Button */}
              <Button
                type="submit"
                colorScheme="purple"
                size="lg"
                w="full"
                mt={4}
                isLoading={isLoading}
              >
                Log In
              </Button>
            </VStack>
          </form>

          {/* Signup Link */}
          <Text textAlign="center" mt={4} color="gray.500">
            Don't have an admin account?{' '}
            <Link to="/admin/signup" style={{ color: 'purple' }}>
              Sign Up
            </Link>
          </Text>
        </VStack>
      </Container>
    </Flex>
  );
};

export default AdminLogin;
