import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { FaBook, FaUserShield, FaUser } from 'react-icons/fa';
import { Link, Navigate } from 'react-router-dom';

const LandingPage = () => {
  const bgGradient = useColorModeValue(
    'linear(to-b, blue.100, white)',
    'linear(to-b, blue.900, gray.800)'
  );
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  // Check authentication
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Redirect if logged in
  if (token) {
    if (role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else if (role === 'client') {
      return <Navigate to="/books" />;
    }
  }

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      py={20}
      position="relative"
      overflow="hidden"
    >
      {/* Background decoration */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="100%"
        opacity={0.1}
        zIndex={0}
        backgroundImage="url('data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E')"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={10} align="center">
          {/* Logo */}
          <Box
            transform="translateY(0)"
            transition="transform 0.3s ease-in-out"
            _hover={{ transform: "translateY(-10px)" }}
            mb={8}
          >
            <Icon as={FaBook} w={20} h={20} color="blue.500" />
          </Box>

          {/* Main Heading */}
          <VStack spacing={4} textAlign="center" mb={12}>
            <Heading
              fontSize={{ base: "4xl", md: "6xl" }}
              fontWeight="bold"
              bgGradient="linear(to-r, blue.400, blue.600)"
              bgClip="text"
            >
              DK Book Stall
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={textColor}
              maxW="2xl"
            >
              Your premier destination for buying and selling books online.
              Join our community of book lovers today!
            </Text>
          </VStack>

          {/* Login Options */}
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={8}
            w="full"
            maxW="4xl"
            justify="center"
          >
            {/* Client Card */}
            <Box
              bg={cardBg}
              p={8}
              borderRadius="xl"
              boxShadow="xl"
              flex={1}
              maxW={{ base: "full", md: "sm" }}
              transform="translateY(0)"
              transition="transform 0.3s ease-in-out"
              _hover={{ transform: "translateY(-8px)" }}
            >
              <VStack spacing={6}>
                <Icon as={FaUser} w={10} h={10} color="blue.500" />
                <Heading size="lg">Client Access</Heading>
                <Text color={textColor} textAlign="center">
                  Browse and purchase books from our extensive collection
                </Text>
                <VStack w="full" spacing={4}>
                  <Button
                    as={Link}
                    to="/client/login"
                    colorScheme="blue"
                    size="lg"
                    w="full"
                  >
                    Client Login
                  </Button>
                  <Button
                    as={Link}
                    to="/client/signup"
                    variant="outline"
                    colorScheme="blue"
                    size="lg"
                    w="full"
                  >
                    Sign Up
                  </Button>
                </VStack>
              </VStack>
            </Box>

            {/* Admin Card */}
            <Box
              bg={cardBg}
              p={8}
              borderRadius="xl"
              boxShadow="xl"
              flex={1}
              maxW={{ base: "full", md: "sm" }}
              transform="translateY(0)"
              transition="transform 0.3s ease-in-out"
              _hover={{ transform: "translateY(-8px)" }}
            >
              <VStack spacing={6}>
                <Icon as={FaUserShield} w={10} h={10} color="blue.500" />
                <Heading size="lg">Admin Portal</Heading>
                <Text color={textColor} textAlign="center">
                  Manage inventory and approve book listings
                </Text>
                <VStack w="full" spacing={4}>
                  <Button
                    as={Link}
                    to="/admin/login"
                    colorScheme="blue"
                    size="lg"
                    w="full"
                  >
                    Admin Login
                  </Button>
                  <Button
                    as={Link}
                    to="/admin/signup"
                    variant="outline"
                    colorScheme="blue"
                    size="lg"
                    w="full"
                  >
                    Admin Sign Up
                  </Button>
                </VStack>
              </VStack>
            </Box>
          </Flex>

          {/* Features */}
          <Box mt={20}>
            <Heading
              textAlign="center"
              mb={10}
              size="xl"
              bgGradient="linear(to-r, blue.400, blue.600)"
              bgClip="text"
            >
              Why Choose DK Book Stall?
            </Heading>
            <HStack
              spacing={8}
              flexWrap="wrap"
              justify="center"
              align="stretch"
            >
              {features.map((feature, index) => (
                <Box
                  key={index}
                  bg={cardBg}
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                  maxW="sm"
                  flex={1}
                  minW={{ base: "full", md: "xs" }}
                  transform="translateY(0)"
                  transition="transform 0.3s ease-in-out"
                  _hover={{ transform: "translateY(-4px)" }}
                >
                  <VStack spacing={4}>
                    <Icon as={feature.icon} w={8} h={8} color="blue.500" />
                    <Heading size="md">{feature.title}</Heading>
                    <Text color={textColor} textAlign="center">
                      {feature.description}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

const features = [
  {
    icon: FaBook,
    title: "Extensive Collection",
    description: "Access a wide variety of books across multiple genres and categories."
  },
  {
    icon: FaUser,
    title: "User-Friendly",
    description: "Easy to use platform for buying and selling books."
  },
  {
    icon: FaUserShield,
    title: "Secure Platform",
    description: "Safe and secure transactions with verified sellers."
  }
];

export default LandingPage;
