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
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AdminSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Admin code validation
    if (!adminCode.trim()) {
      newErrors.adminCode = 'Admin code is required';
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
      const response = await axios.post('http://localhost:5000/api/auth/admin/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        adminSecret: adminCode
      });

      toast({
        title: 'Signup Successful',
        description: 'You can now log in to your admin account',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/admin/login');
    } catch (error) {
      toast({
        title: 'Signup Failed',
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
              Admin Signup
            </Heading>
            <Text color="gray.500">Create an admin account for DK Book Stall</Text>
          </Box>

          {/* Admin Code Alert */}
          <Alert status="info" variant="left-accent">
            <AlertIcon />
            You need an admin code to create an admin account.
          </Alert>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              {/* Username */}
              <FormControl isInvalid={!!errors.username}>
                <FormLabel>
                  <Flex align="center">
                    <Icon as={FaUser} mr={2} color="purple.500" />
                    Username
                  </Flex>
                </FormLabel>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  variant="filled"
                  focusBorderColor="purple.500"
                />
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              </FormControl>

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
                  placeholder="Enter your email"
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
                    placeholder="Enter your password"
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

              {/* Confirm Password */}
              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>
                  <Flex align="center">
                    <Icon as={FaLock} mr={2} color="purple.500" />
                    Confirm Password
                  </Flex>
                </FormLabel>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  variant="filled"
                  focusBorderColor="purple.500"
                />
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
              </FormControl>

              {/* Admin Code */}
              <FormControl isInvalid={!!errors.adminCode}>
                <FormLabel>
                  <Flex align="center">
                    <Icon as={FaShieldAlt} mr={2} color="purple.500" />
                    Admin Code
                  </Flex>
                </FormLabel>
                <Input
                  name="adminCode"
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter admin code"
                  variant="filled"
                  focusBorderColor="purple.500"
                />
                <FormErrorMessage>{errors.adminCode}</FormErrorMessage>
              </FormControl>

              {/* Submit Button */}
              <Button
                type="submit"
                colorScheme="purple"
                size="lg"
                w="full"
                mt={4}
                isLoading={isLoading}
              >
                Create Admin Account
              </Button>
            </VStack>
          </form>

          {/* Login Link */}
          <Text textAlign="center" mt={4} color="gray.500">
            Already have an admin account?{' '}
            <Link to="/admin/login" style={{ color: 'purple' }}>
              Log In
            </Link>
          </Text>
        </VStack>
      </Container>
    </Flex>
  );
};

export default AdminSignup;
