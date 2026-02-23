export interface GalleryImage {
  id: string;
  image: any;
  alt: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: '1',
    image: require('@/assets/images/gallery/gallery-1.jpg'),
    alt: 'Travel photo 1',
  },
  {
    id: '2',
    image: require('@/assets/images/gallery/gallery-2.jpg'),
    alt: 'Travel photo 2',
  },
  {
    id: '3',
    image: require('@/assets/images/gallery/gallery-3.jpg'),
    alt: 'Travel photo 3',
  },
  {
    id: '4',
    image: require('@/assets/images/gallery/gallery-4.jpg'),
    alt: 'Travel photo 4',
  },
  {
    id: '5',
    image: require('@/assets/images/gallery/gallery-5.jpg'),
    alt: 'Travel photo 5',
  },
];
