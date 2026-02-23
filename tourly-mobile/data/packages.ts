export interface TravelPackage {
  id: string;
  title: string;
  description: string;
  duration: string;
  maxPax: number;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: any;
}

export const packages: TravelPackage[] = [
  {
    id: '1',
    title: 'Experience The Great Holiday On Beach',
    description: 'Laoreet, voluptatum nihil dolor esse quaerat mattis explicabo maiores, est aliquet porttitor! Eaque, cras, aspernatur.',
    duration: '7D/6N',
    maxPax: 10,
    location: 'Malaysia',
    price: 750,
    rating: 5,
    reviews: 25,
    image: require('@/assets/images/packages/packege-1.jpg'),
  },
  {
    id: '2',
    title: 'Summer Holiday To The Oxolotan River',
    description: 'Laoreet, voluptatum nihil dolor esse quaerat mattis explicabo maiores, est aliquet porttitor! Eaque, cras, aspernatur.',
    duration: '7D/6N',
    maxPax: 10,
    location: 'Malaysia',
    price: 520,
    rating: 5,
    reviews: 20,
    image: require('@/assets/images/packages/packege-2.jpg'),
  },
  {
    id: '3',
    title: "Santorini Island's Weekend Vacation",
    description: 'Laoreet, voluptatum nihil dolor esse quaerat mattis explicabo maiores, est aliquet porttitor! Eaque, cras, aspernatur.',
    duration: '7D/6N',
    maxPax: 10,
    location: 'Malaysia',
    price: 660,
    rating: 5,
    reviews: 40,
    image: require('@/assets/images/packages/packege-3.jpg'),
  },
];
