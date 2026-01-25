// Utility function to get all boats from the Catamarans folder
// Using Vite's import.meta.glob to dynamically import all boat images

// Match all images in Catamarans folder
const allImages = import.meta.glob('/src/assets/Catamarans/**/*.{png,jpeg,jpg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

export interface Boat {
  id: string;
  name: string;
  image: string; // Main image for thumbnail
  boatImages: string[]; // All boat images (boat1, boat2, etc.)
  interiors: string[];
}

// Helper function to check if a file is a boat image (not interior)
const isBoatImage = (fileName: string): boolean => {
  const lowerFileName = fileName.toLowerCase();
  return (
    (lowerFileName.includes('boat') || lowerFileName.includes('heli')) &&
    !lowerFileName.includes('interior')
  );
};

// Helper function to check if a file is an interior image
const isInteriorImage = (fileName: string): boolean => {
  const lowerFileName = fileName.toLowerCase();
  return (
    lowerFileName.includes('interior') ||
    lowerFileName.includes('m-interior') ||
    lowerFileName.includes('s-interior') ||
    lowerFileName.includes('u-interior')
  );
};

// Map folder names to display names
const getBoatDisplayName = (folderName: string): string => {
  const nameMap: Record<string, string> = {
    'Misbehaviour catamaran': 'MISBEHAVIOUR CATAMARAN',
    'Sunday Kinga': 'SUNDAY KINGA CATAMARAN',
    'Umoja': 'UMOJA CATAMARAN',
    'Black Bird Heli': 'BLACK BIRD HELI',
    'Queen of Zanzibar': 'QUEEN OF ZANZIBAR',
    'Amani Luxury': 'AMANI LUXURY CATAMARAN',
    'Helia 44 Catamaran': 'HELIA 44 CATAMARAN',
    'Butterfly Catamaran': 'BUTTERFLY CATAMARAN',
    'Seamanta catamaran': 'SEAMANTA CATAMARAN',
    'Knlyps catamaran': 'KNLYPS CATAMARAN',
    'Vaatea catamaran': 'VAATEA CATAMARAN',
    'Albion catamaran': 'ALBION CATAMARAN',
  };
  
  return nameMap[folderName] || folderName.replace(' catamaran', '').replace(' Catamaran', '').toUpperCase();
};

export const getAllBoats = (): Boat[] => {
  const boats: Boat[] = [];
  const boatMap = new Map<string, Boat>();

  // First pass: Create boats from boat images
  Object.entries(allImages).forEach(([path, image]) => {
    const pathParts = path.split('/');
    const boatFolder = pathParts[pathParts.length - 2];
    const fileName = pathParts[pathParts.length - 1];
    
    // Create a clean ID from the folder name
    const boatId = boatFolder
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(' catamaran', '')
      .replace(' catamaran', '');
    
    const boatName = getBoatDisplayName(boatFolder);

    // Handle boat images - create boat entry
    if (isBoatImage(fileName)) {
      if (!boatMap.has(boatId)) {
        boatMap.set(boatId, {
          id: boatId,
          name: boatName,
          image: image as string,
          boatImages: [image as string],
          interiors: [],
        });
      } else {
        const existingBoat = boatMap.get(boatId)!;
        const imageUrl = image as string;
        
        // Always add to boatImages array if not already present
        if (!existingBoat.boatImages.includes(imageUrl)) {
          existingBoat.boatImages.push(imageUrl);
        }
        
        // Set main image - prefer boat1.png, then boat.png, then others
        const lowerFileName = fileName.toLowerCase();
        const existingFileName = existingBoat.image.split('/').pop()?.toLowerCase() || '';
        
        if (lowerFileName.includes('boat1')) {
          existingBoat.image = imageUrl;
        } else if (lowerFileName.includes('boat') && !existingFileName.includes('boat1') && !existingFileName.includes('boat2')) {
          existingBoat.image = imageUrl;
        }
      }
    }
  });

  // Second pass: Add interior images to existing boats
  Object.entries(allImages).forEach(([path, image]) => {
    const pathParts = path.split('/');
    const boatFolder = pathParts[pathParts.length - 2];
    const fileName = pathParts[pathParts.length - 1];
    
    // Create a clean ID from the folder name
    const boatId = boatFolder
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(' catamaran', '')
      .replace(' catamaran', '');
    
    // Handle interior images - add to existing boat
    if (isInteriorImage(fileName)) {
      // If boat doesn't exist yet (only has interior images), create it
      if (!boatMap.has(boatId)) {
        const boatName = getBoatDisplayName(boatFolder);
        boatMap.set(boatId, {
          id: boatId,
          name: boatName,
          image: image as string, // Use first interior as placeholder, will be replaced if boat image found
          boatImages: [],
          interiors: [image as string],
        });
      } else {
        const boat = boatMap.get(boatId)!;
        if (!boat.interiors.includes(image as string)) {
          boat.interiors.push(image as string);
        }
      }
    }
  });

  // Convert map to array and sort by name
  boats.push(...Array.from(boatMap.values()));
  
  // Sort boat images within each boat (boat1 before boat2, etc.)
  boats.forEach(boat => {
    boat.boatImages.sort((a, b) => {
      const aName = a.split('/').pop()?.toLowerCase() || '';
      const bName = b.split('/').pop()?.toLowerCase() || '';
      
      // Extract numbers from filenames for proper sorting
      const aMatch = aName.match(/(\d+)/);
      const bMatch = bName.match(/(\d+)/);
      
      if (aMatch && bMatch) {
        return parseInt(aMatch[1]) - parseInt(bMatch[1]);
      }
      
      // If no numbers, sort alphabetically
      return aName.localeCompare(bName);
    });
    
    // Sort interior images
    boat.interiors.sort((a, b) => {
      const aName = a.split('/').pop()?.toLowerCase() || '';
      const bName = b.split('/').pop()?.toLowerCase() || '';
      
      // Extract numbers from filenames for proper sorting
      const aMatch = aName.match(/(\d+)/);
      const bMatch = bName.match(/(\d+)/);
      
      if (aMatch && bMatch) {
        return parseInt(aMatch[1]) - parseInt(bMatch[1]);
      }
      
      return aName.localeCompare(bName);
    });
    
    // Debug log for Sunday Kinga
    if (boat.id === 'sunday-kinga') {
      console.log('Sunday Kinga images:', {
        boatImages: boat.boatImages.length,
        interiors: boat.interiors.length,
        total: boat.boatImages.length + boat.interiors.length,
        boatImagesList: boat.boatImages.map(img => img.split('/').pop()),
        interiorsList: boat.interiors.map(img => img.split('/').pop())
      });
    }
  });
  
  // Sort boats alphabetically by name
  boats.sort((a, b) => a.name.localeCompare(b.name));

  return boats;
};

// Get boat by ID
export const getBoatById = (id: string): Boat | null => {
  const boats = getAllBoats();
  return boats.find(boat => boat.id === id) || null;
};

