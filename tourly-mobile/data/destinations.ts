export interface Destination {
  id: string;
  name: string;
  country: string;
  rating: number;
  description: string;
  image: any;
}

export const destinations: Destination[] = [
  {
    id: '1',
    name: 'San Miguel',
    country: 'Italy',
    rating: 5,
    description: 'Fusce hic augue velit wisi ips quibusdam pariatur, iusto.',
    image: require('@/assets/images/destinations/popular-1.jpg'),
  },
  {
    id: '2',
    name: 'Burj Khalifa',
    country: 'Dubai',
    rating: 5,
    description: 'Fusce hic augue velit wisi ips quibusdam pariatur, iusto.',
    image: require('@/assets/images/destinations/popular-2.jpg'),
  },
  {
    id: '3',
    name: 'Kyoto Temple',
    country: 'Japan',
    rating: 5,
    description: 'Fusce hic augue velit wisi ips quibusdam pariatur, iusto.',
    image: require('@/assets/images/destinations/popular-3.jpg'),
  },
];
