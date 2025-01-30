import { Box, Flex, Button, Heading, Spacer, ButtonGroup, Icon, HStack } from '@chakra-ui/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBook } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  // Don't show navbar on landing page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <Box 
      bg="blue.500" 
      px={4} 
      py={2}
      position="sticky"
      top={0}
      zIndex={100}
      boxShadow="md"
      bgGradient="linear(to-r, blue.400, blue.600)"
    >
      <Flex alignItems="center" maxW="container.xl" mx="auto">
        <Link to={role === 'admin' ? '/admin/dashboard' : '/client/dashboard'}>
          <HStack spacing={3}>
            <Icon as={FaBook} w={6} h={6} color="white" />
            <Heading size="md" color="white">DK Book Stall</Heading>
          </HStack>
        </Link>
        <Spacer />
        <ButtonGroup spacing={4}>
          {!token && (
            <>
              <Button 
                as={Link} 
                to="/client/login" 
                colorScheme="whiteAlpha"
                _hover={{ bg: 'whiteAlpha.300' }}
              >
                Login
              </Button>
              <Button 
                as={Link} 
                to="/client/signup" 
                colorScheme="whiteAlpha"
                variant="outline"
                _hover={{ bg: 'whiteAlpha.200' }}
              >
                Sign Up
              </Button>
            </>
          )}
          {token && role === 'client' && (
            <>
              <Button 
                as={Link} 
                to="/client/dashboard" 
                colorScheme="whiteAlpha"
                _hover={{ bg: 'whiteAlpha.300' }}
              >
                Dashboard
              </Button>
              <Button 
                as={Link} 
                to="/books" 
                colorScheme="whiteAlpha"
                _hover={{ bg: 'whiteAlpha.300' }}
              >
                Browse Books
              </Button>
              <Button 
                as={Link} 
                to="/sell-book" 
                colorScheme="whiteAlpha"
                _hover={{ bg: 'whiteAlpha.300' }}
              >
                Sell Book
              </Button>
              <Button 
                as={Link} 
                to="/my-books" 
                colorScheme="whiteAlpha"
                _hover={{ bg: 'whiteAlpha.300' }}
              >
                My Books
              </Button>
              <Button 
                onClick={handleLogout} 
                colorScheme="red"
                _hover={{ bg: 'red.500' }}
              >
                Logout
              </Button>
            </>
          )}
          {token && role === 'admin' && (
            <>
              <Button 
                as={Link} 
                to="/admin/dashboard" 
                colorScheme="whiteAlpha"
                _hover={{ bg: 'whiteAlpha.300' }}
              >
                Dashboard
              </Button>
              <Button 
                onClick={handleLogout} 
                colorScheme="red"
                _hover={{ bg: 'red.500' }}
              >
                Logout
              </Button>
            </>
          )}
        </ButtonGroup>
      </Flex>
    </Box>
  );
};

export default Navbar;
