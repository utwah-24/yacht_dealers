import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Utensils, Wine, Music, Ship, ChevronRight, ChevronLeft, Sparkles, Waves, Anchor } from "lucide-react";
import bookingSlideshow1 from "@/assets/new images/IMG_0718.jpg";
import bookingSlideshow2 from "@/assets/new images/IMG_0735.jpg";
import bookingSlideshow3 from "@/assets/new images/IMG_5965.png";
import bookingSlideshow4 from "@/assets/new images/IMG_6323.png";
import bookingSlideshow5 from "@/assets/new images/IMG_9568.jpg";
import bookingSlideshow6 from "@/assets/new images/IMG_9572.jpg";
import { getAllBoats } from "@/utils/boats";
import backgroundImage from "@/assets/background.jpg";

/** Helicopter fleet (Sunbird). */
function isHelicopterBoat(id: string | null | undefined): boolean {
  return id === "sunbird-heli";
}

/** Helicopter package price label (Sunbird exclusive & transfers) */
function getHelicopterPriceForBoat(boatId: string | null | undefined, charterType: string): string {
  if (boatId !== "sunbird-heli") return "";
  const sunbird: Record<string, string> = {
    "15 Minute Exclusive": "$600",
    "30 Minute Exclusive": "$1,100",
    "1 Hour Exclusive": "$1,950",
    "Dar - Zanzibar Transfer": "$2,400",
    "Dar - Kilimanjaro Transfer": "$9,600",
    "Dar - Dodoma Transfer": "$8,400",
    "Customize Transfer": "Call +255 741 426 886",
  };
  return sunbird[charterType] || "";
}

function isHelicopterQuoteOnRequest(boatId: string | null | undefined, charterType: string): boolean {
  return boatId === "sunbird-heli" && charterType === "Customize Transfer";
}

// Charter pricing data (food & drinks included in all prices)
const charterOptions = [
  {
    location: "Dar Yacht Charter",
    packages: [
      {
        yacht: "22 Max Catamaran",
        options: [
          { type: "Half Day Charter (6 Hours)", price: "$1,500" },
          { type: "Full Day Charter (11 Hours)", price: "$2,000" },
          { type: "Live Onboard (24 Hours)", price: "$3,000" },
        ],
      },
    ],
  },
  {
    location: "Zanzibar Charter",
    packages: [
      {
        yacht: "22 Max Catamaran",
        options: [
          { type: "Half Day Cruise (6 Hours)", price: "$1,700" },
          { type: "Full Day Cruise (11 Hours)", price: "$2,200" },
          { type: "Live Onboard (24 Hours)", price: "$3,200" },
        ],
      },
    ],
  },
];

// Sunset cruise pricing (food included; -$200 if own food)
const sunsetCharterOptions = [
  {
    location: "Dar Yacht Charter",
    packages: [
      {
        yacht: "22 Max Catamaran",
        options: [{ type: "3 Hours", price: "$800" }],
      },
    ],
  },
  {
    location: "Zanzibar Charter",
    packages: [
      {
        yacht: "22 Max Catamaran",
        options: [{ type: "3 Hours", price: "$1,200" }],
      },
    ],
  },
];

// Queen of Zanzibar exclusive pricing (38 Max Catamaran only)
const queenOfZanzibarCharterOptions = [
  {
    location: "Dar Yacht Charter",
    packages: [
      {
        yacht: "38 Max Catamaran",
        options: [
          { type: "Half Day Charter (6 Hours)", price: "$4,500" },
          { type: "Full Day Charter (11 Hours)", price: "$5,500" },
          { type: "Live Onboard (24 Hours)", price: "$8,000" },
        ],
      },
    ],
  },
  {
    location: "Zanzibar Charter",
    packages: [
      {
        yacht: "38 Max Catamaran",
        options: [
          { type: "Half Day Cruise (6 Hours)", price: "$4,000" },
          { type: "Full Day Cruise (11 Hours)", price: "$5,000" },
          { type: "Live Onboard (24 Hours)", price: "$7,500" },
        ],
      },
    ],
  },
];

// Misbehaviour Catamaran exclusive pricing (20 Max only)
const misbehaviourCharterOptions = [
  {
    location: "Dar Yacht Charter",
    packages: [
      {
        yacht: "20 Max Catamaran",
        options: [
          { type: "Half Day Charter (6 Hours)", price: "$1,200" },
          { type: "Full Day Charter (11 Hours)", price: "$1,700" },
          { type: "Live Onboard (24 Hours)", price: "$2,500" },
        ],
      },
    ],
  },
  {
    location: "Zanzibar Charter",
    packages: [
      {
        yacht: "20 Max Catamaran",
        options: [
          { type: "Half Day Cruise (6 Hours)", price: "$1,500" },
          { type: "Full Day Cruise (11 Hours)", price: "$2,000" },
          { type: "Live Onboard (24 Hours)", price: "$2,800" },
        ],
      },
    ],
  },
];

// Misbehaviour Catamaran sunset cruise pricing (20 Max only)
const misbehaviourSunsetCharterOptions = [
  {
    location: "Dar Yacht Charter",
    packages: [
      {
        yacht: "20 Max Catamaran",
        options: [{ type: "3 Hours", price: "$800" }],
      },
    ],
  },
  {
    location: "Zanzibar Charter",
    packages: [
      {
        yacht: "20 Max Catamaran",
        options: [{ type: "3 Hours", price: "$1,200" }],
      },
    ],
  },
];

// Pelagic Catamaran exclusive pricing (15 Max only)
const pelagicCharterOptions = [
  {
    location: "Dar Yacht Charter",
    packages: [
      {
        yacht: "15 Max Catamaran",
        options: [
          { type: "Half Day Charter (6 Hours)", price: "$1,100" },
          { type: "Full Day Charter (11 Hours)", price: "$1,600" },
          { type: "Live Onboard (24 Hours)", price: "$2,200" },
        ],
      },
    ],
  },
  {
    location: "Zanzibar Charter",
    packages: [
      {
        yacht: "15 Max Catamaran",
        options: [
          { type: "Half Day Cruise (6 Hours)", price: "$1,500" },
          { type: "Full Day Cruise (11 Hours)", price: "$2,000" },
          { type: "Live Onboard (24 Hours)", price: "$2,800" },
        ],
      },
    ],
  },
];

// Pelagic Catamaran sunset cruise pricing (15 Max only)
const pelagicSunsetCharterOptions = [
  {
    location: "Dar Yacht Charter",
    packages: [
      {
        yacht: "15 Max Catamaran",
        options: [{ type: "3 Hours", price: "$800" }],
      },
    ],
  },
  {
    location: "Zanzibar Charter",
    packages: [
      {
        yacht: "15 Max Catamaran",
        options: [{ type: "3 Hours", price: "$1,200" }],
      },
    ],
  },
];

// CONSTATINE LUXURY BOAT — USD (~equiv. 1.1m / 1.3m / 350k TSh); Dar-only
const constatineYachtTypes = ["8 Max Catamaran"] as const;

/** Dar-only — this vessel does not offer Zanzibar Hotel departures. */
const constatineCharterOptions = [
  {
    location: "Dar Yacht Charter",
    packages: [
      {
        yacht: "8 Max Catamaran",
        options: [
          { type: "1 trip — Bongoyo (incl. marine tickets)", price: "$430" },
          { type: "1 trip — Mbudya (incl. marine tickets)", price: "$510" },
          { type: "1 hour boat cruise", price: "$140" },
        ],
      },
    ],
  },
];

function isConstatineBoat(id: string | null | undefined): boolean {
  return id === "constatine-luxury-boat";
}

/** CONSTATINE: one price per Dar destination; sunset = 1h cruise only. */
function filterConstatineDarPackages(
  departure: string,
  destination: string | undefined,
  darOptions: { type: string; price: string }[],
): { type: string; price: string }[] {
  if (departure === "cruising") {
    return darOptions.filter((o) => o.type.toLowerCase().includes("1 hour"));
  }
  if (departure !== "dar-slipway" || !destination) {
    return [];
  }
  if (destination === "bongoyo") {
    return darOptions.filter((o) => /bongoyo/i.test(o.type));
  }
  if (destination === "mbudya") {
    return darOptions.filter((o) => /mbudya/i.test(o.type));
  }
  return [];
}

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  destination: z.string().optional(),
  charter: z.string().min(1, "Please select a charter package"),
  date: z.string().min(1, "Please select a date"),
  passengers: z.string().min(1, "Please enter number of passengers"),
  foodDrinksRequests: z.string().optional(),
  dj: z.boolean(),
  activities: z.array(z.string()).optional(),
  otherActivity: z.string().optional(),
  catamaran: z.string().optional(),
  allergies: z.string().optional(),
  specialOccasion: z.string().optional(),
  marineTicketNonTanzanian: z.boolean(),
  marineTicketTanzanian: z.boolean(),
});

type BookingForm = z.infer<typeof bookingSchema>;

const bookingImages = [
  bookingSlideshow1,
  bookingSlideshow2,
  bookingSlideshow3,
  bookingSlideshow4,
  bookingSlideshow5,
  bookingSlideshow6,
];

const yachtTypes = ["22 Max Catamaran"];
const queenOfZanzibarYachtTypes = ["38 Max Catamaran"];
const misbehaviourYachtTypes = ["20 Max Catamaran"];
const pelagicYachtTypes = ["15 Max Catamaran"];

// Boat metadata for capacity and description
const boatMetadata: Record<string, { capacity: string; description: string }> = {
  "misbehaviour-catamaran": {
    capacity: "20 passengers",
    description: "20 passengers max, perfect for private cruises.",
  },
  "sunday-kinga": {
    capacity: "22 passengers",
    description: "22-passengers, ideal for group celebrations.",
  },
  "umoja": {
    capacity: "22 passengers",
    description: "22-passengers, comfortable for full-day trips.",
  },
  "albion-catamaran": {
    capacity: "22 passengers",
    description: "Premium catamaran with excellent facilities.",
  },
  "amani-luxury": {
    capacity: "22 passengers",
    description: "Luxury catamaran with premium amenities.",
  },
  "sunbird-heli": {
    capacity: "4 passengers",
    description: "Exclusive flights & transfer charters. @flysunbird — same booking options as on our rate card.",
  },
  "butterfly-catamaran": {
    capacity: "22 passengers",
    description: "Elegant catamaran perfect for special occasions.",
  },
  "helia-44-catamaran": {
    capacity: "22 passengers",
    description: "Spacious 44-foot catamaran for comfortable cruising.",
  },
  "knlyps-catamaran": {
    capacity: "22 passengers",
    description: "Modern catamaran with excellent facilities.",
  },
  "queen-of-zanzibar": {
    capacity: "38 passengers",
    description: "Royal catamaran experience in Zanzibar waters.",
  },
  "seamanta-catamaran": {
    capacity: "22 passengers",
    description: "Comfortable catamaran for day trips.",
  },
  "vaatea-catamaran": {
    capacity: "22 passengers",
    description: "Luxury catamaran with premium features.",
  },
  "jetski": {
    capacity: "2 passengers",
    description: "High-performance jet ski for thrilling rides on Tanzania's waters.",
  },
  "pelagic-catamaran": {
    capacity: "15 passengers",
    description: "Premium catamaran with excellent facilities.",
  },
  "constatine-luxury-boat": {
    capacity: "8 passengers",
    description:
      "Max 8 guests; Dar Slipway departures only. $430 / $510 / $140 USD (approx. prior TSh rates). Marine tickets included on island trips.",
  },
};

// Generate catalog from all boats
const generateCatamaranCatalog = () => {
  const allBoats = getAllBoats();
  return allBoats.map((boat) => {
    const metadata = boatMetadata[boat.id] || {
      capacity: "22 passengers",
      description: "Premium catamaran for your charter experience.",
    };
    return {
      id: boat.id,
      name: boat.name,
      description: `Description: ${metadata.description}`,
      capacity: metadata.capacity,
      image: boat.image,
    };
  });
};

const BookingPage = () => {
  const routerLocation = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [djEnabled, setDjEnabled] = useState(false);
  const [bringOwnFood, setBringOwnFood] = useState(false);
  const [jetskiAddon, setJetskiAddon] = useState(false);
  const [jetskiAddonPackage, setJetskiAddonPackage] = useState<string>("");

  const displayPrice = (price: string) => {
    if (!bringOwnFood) return price;
    const num = parseInt(price.replace(/[$,]/g, ""), 10);
    return `$${(num - 200).toLocaleString()}`;
  };
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCharterType, setSelectedCharterType] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCatamaranId, setSelectedCatamaranId] = useState<string | null>(null);
  const [selectedDeparture, setSelectedDeparture] = useState<string>("");
  const [departureError, setDepartureError] = useState(false);
  const [marineTicketNonTanzanian, setMarineTicketNonTanzanian] = useState(false);
  const [marineTicketTanzanian, setMarineTicketTanzanian] = useState(false);
  const catamaranCatalog = useMemo(() => generateCatamaranCatalog(), []);
  const preselectedCatamaranId = (routerLocation.state as any)?.preselectedCatamaranId as
    | string
    | undefined;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bookingImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      dj: false,
      foodDrinksRequests: "",
      activities: [],
      otherActivity: "",
      charter: "",
      passengers: "2",
      catamaran: "",
      allergies: "",
      specialOccasion: "",
      marineTicketNonTanzanian: false,
      marineTicketTanzanian: false,
    },
  });

  const watched = watch();

  // If a user arrives from Boat Details, preselect that catamaran so Step 2 skips the "choose a catamaran" list.
  useEffect(() => {
    if (!preselectedCatamaranId) return;
    if (selectedCatamaranId) return;
    const found = catamaranCatalog.find((item) => item.id === preselectedCatamaranId);
    if (!found) return;

    setSelectedCatamaranId(found.id);
    setValue("catamaran", found.name);
  }, [preselectedCatamaranId, selectedCatamaranId, catamaranCatalog, setValue]);

  // CONSTATINE only departs Dar — clear Zanzibar Hotel selection if user switches to this boat.
  useEffect(() => {
    if (!isConstatineBoat(selectedCatamaranId)) return;
    if (selectedDeparture !== "znz-hotel-verde") return;
    setSelectedDeparture("");
    setValue("destination", "");
    setSelectedLocation("");
    setSelectedCharterType("");
    setValue("charter", "");
  }, [selectedCatamaranId, selectedDeparture, setValue]);

  // CONSTATINE does not offer Fungu ya Sini — clear if it was left in form state.
  useEffect(() => {
    if (!isConstatineBoat(selectedCatamaranId)) return;
    if (watched.destination !== "fungu-ya-sini") return;
    setValue("destination", "");
    setSelectedLocation("");
    setSelectedCharterType("");
    setValue("charter", "");
  }, [selectedCatamaranId, watched.destination, setValue]);

  const activityOptions = [
    "Sunbathing and relaxation",
    "Water sports (e.g., snorkeling, diving, paddleboarding)",
    "Dining at exclusive restaurants",
    "Private beach excursions",
    "Cultural experiences (e.g., visits to local villages, markets)",
    "Wine tasting and luxury dining onboard",
    "Family-friendly activities (e.g., kids’ clubs, educational tours)",
    "Romantic getaways (e.g., private dinners, sunset cruises)",
    "Other",
  ];

  const departureOptions = [
    { value: "dar-slipway", label: "Dar Slipway" },
    { value: "znz-hotel-verde", label: "Znz Hotel Verde" },
    { value: "cruising", label: "Sunset Cruise" },
  ];

  const departureOptionsForBoat = useMemo(() => {
    if (isConstatineBoat(selectedCatamaranId)) {
      return departureOptions.filter((d) => d.value !== "znz-hotel-verde");
    }
    return departureOptions;
  }, [selectedCatamaranId]);

  const destinationsByDeparture: Record<string, { value: string; label: string }[]> = {
    "dar-slipway": [
      { value: "bongoyo", label: "Bongoyo" },
      { value: "mbudya", label: "Mbudya" },
      { value: "fungu-ya-sini", label: "Fungu ya Sini" },
    ],
    "znz-hotel-verde": [
      { value: "prison-island", label: "Prison Island" },
      { value: "nakupenda", label: "Nakupenda" },
      { value: "ocean-view", label: "Ocean View" },
    ],
  };

  const destinations = useMemo(() => {
    const base = selectedDeparture ? (destinationsByDeparture[selectedDeparture] ?? []) : [];
    if (!isConstatineBoat(selectedCatamaranId)) return base;
    return base.filter((d) => d.value !== "fungu-ya-sini");
  }, [selectedDeparture, selectedCatamaranId]);

  const islandDestinationValues = useMemo(
    () => new Set(["bongoyo", "mbudya", "fungu-ya-sini", "prison-island", "nakupenda"]),
    []
  );

  const isIslandDestinationSelected = useMemo(
    () => !!watched.destination && islandDestinationValues.has(watched.destination),
    [watched.destination, islandDestinationValues]
  );

  useEffect(() => {
    if (isIslandDestinationSelected) return;
    setMarineTicketNonTanzanian(false);
    setMarineTicketTanzanian(false);
    setValue("marineTicketNonTanzanian", false);
    setValue("marineTicketTanzanian", false);
  }, [isIslandDestinationSelected, setValue]);

  const effectiveYachtType = useMemo(() => {
    if (!selectedCatamaranId) return "";
    if (selectedCatamaranId === "queen-of-zanzibar") return queenOfZanzibarYachtTypes[0];
    if (selectedCatamaranId === "misbehaviour-catamaran") return misbehaviourYachtTypes[0];
    if (selectedCatamaranId === "pelagic-catamaran") return pelagicYachtTypes[0];
    if (selectedCatamaranId === "constatine-luxury-boat") return constatineYachtTypes[0];
    if (isHelicopterBoat(selectedCatamaranId) || selectedCatamaranId === "jetski") return "";
    return yachtTypes[0];
  }, [selectedCatamaranId]);

  // Helicopter-specific pickup points
  const helicopterPickupPoints = [
    { value: "seacliff", label: "SEACLIFF" },
    { value: "seacliff-airport", label: "SEACLIFF/AIRPORT" },
  ];

  const getJetskiPrice = (charterType: string): string => {
    const prices: Record<string, string> = {
      "Half Day": "$900",
      "Full Day": "$1,500",
    };
    return prices[charterType] || "";
  };

  // Get prices for selected yacht (boat-specific and sunset cruise use separate pricing)
  const getYachtPrices = (yachtType: string) => {
    const isQoZ = selectedCatamaranId === "queen-of-zanzibar";
    const isMisbehaviour = selectedCatamaranId === "misbehaviour-catamaran";
    const isPelagic = selectedCatamaranId === "pelagic-catamaran";
    const isSunset = selectedDeparture === "cruising";

    let options;
    if (selectedCatamaranId === "constatine-luxury-boat") {
      options = constatineCharterOptions;
    } else if (isQoZ) {
      options = queenOfZanzibarCharterOptions;
    } else if (isMisbehaviour && isSunset) {
      options = misbehaviourSunsetCharterOptions;
    } else if (isMisbehaviour) {
      options = misbehaviourCharterOptions;
    } else if (isPelagic && isSunset) {
      options = pelagicSunsetCharterOptions;
    } else if (isPelagic) {
      options = pelagicCharterOptions;
    } else if (isSunset) {
      options = sunsetCharterOptions;
    } else {
      options = charterOptions;
    }

    const darPkg = options[0]?.packages?.find((pkg) => pkg.yacht === yachtType);
    const zanzibarPkg = options[1]?.packages?.find((pkg) => pkg.yacht === yachtType);
    return {
      dar: darPkg?.options || [],
      zanzibar: zanzibarPkg?.options || [],
    };
  };

  const yachtPrices = useMemo(
    () =>
      effectiveYachtType ? getYachtPrices(effectiveYachtType) : { dar: [], zanzibar: [] },
    [effectiveYachtType, selectedDeparture, selectedCatamaranId]
  );

  const darCharterPackagesForUi = useMemo(() => {
    if (!isConstatineBoat(selectedCatamaranId)) {
      return yachtPrices.dar;
    }
    return filterConstatineDarPackages(
      selectedDeparture,
      watched.destination,
      yachtPrices.dar,
    );
  }, [
    selectedCatamaranId,
    selectedDeparture,
    watched.destination,
    yachtPrices.dar,
  ]);

  const constatineDarSectionTitle =
    selectedDeparture === "cruising" ? "Sunset cruise" : "Dar Yacht Charter";

  // Base charter / package price (same sources as UI pricing)
  const baseCharterPrice = useMemo(() => {
    if (!watched.charter) return 0;
    if (isHelicopterBoat(selectedCatamaranId)) {
      const parts = watched.charter.split("|");
      if (parts.length < 2) return 0;
      const charterType = parts[1];
      const p = getHelicopterPriceForBoat(selectedCatamaranId, charterType);
      if (!p || p.includes("Request") || p.includes("Call")) return 0;
      return parseInt(p.replace(/[$,]/g, ""), 10) || 0;
    }
    if (selectedCatamaranId === "jetski") {
      const parts = watched.charter.split("|");
      if (parts.length < 2) return 0;
      const charterType = parts[1];
      const p = getJetskiPrice(charterType);
      if (!p) return 0;
      return parseInt(p.replace(/[$,]/g, ""), 10) || 0;
    }
    const parts = watched.charter.split("|");
    if (parts.length < 3) return 0;
    const [location, yacht, charterType] = parts;
    const { dar, zanzibar } = getYachtPrices(yacht);
    const opts = location === "Dar Yacht Charter" ? dar : zanzibar;
    const opt = opts.find((o) => o.type === charterType);
    if (!opt) return 0;
    return parseInt(opt.price.replace(/[$,]/g, ""), 10) || 0;
  }, [watched.charter, selectedCatamaranId, selectedDeparture, effectiveYachtType]);

  const jetskiAddonAmount = useMemo(() => {
    if (!jetskiAddon || !jetskiAddonPackage) return 0;
    return jetskiAddonPackage === "Half Day" ? 900 : 1500;
  }, [jetskiAddon, jetskiAddonPackage]);

  // Grand total: charter + own-food / DJ / jetski add-on (yachts); heli & jetski = package only
  const grandTotalPrice = useMemo(() => {
    const isSpecial = isHelicopterBoat(selectedCatamaranId) || selectedCatamaranId === "jetski";
    if (isSpecial) {
      return baseCharterPrice > 0 ? baseCharterPrice : null;
    }
    if (baseCharterPrice === 0) return null;
    let total = baseCharterPrice;
    if (bringOwnFood) total -= 200;
    if (djEnabled) total += 150;
    total += jetskiAddonAmount;
    return total;
  }, [baseCharterPrice, selectedCatamaranId, bringOwnFood, djEnabled, jetskiAddonAmount]);

  const formattedGrandTotal =
    grandTotalPrice !== null ? `$${grandTotalPrice.toLocaleString()}` : null;

  const isHelicopterSpecialCharter =
    isHelicopterBoat(selectedCatamaranId) &&
    isHelicopterQuoteOnRequest(selectedCatamaranId, watched.charter?.split("|")[1] || "");

  const handleCharterSelect = (location: string, charterType: string) => {
    setSelectedLocation(location);
    setSelectedCharterType(charterType);
    // For helicopter/jetski services, don't include yacht in the charter value
    const isSpecial = isHelicopterBoat(selectedCatamaranId) || selectedCatamaranId === "jetski";
    const charterValue = isSpecial
      ? `${location}|${charterType}`
      : `${location}|${effectiveYachtType}|${charterType}`;
    setValue("charter", charterValue);

    // For helicopter, auto-set pickup point (no dropdown).
    if (isHelicopterBoat(selectedCatamaranId)) {
      if (selectedCatamaranId === "sunbird-heli") {
        const isNumericTransfer =
          charterType.endsWith("Transfer") && charterType !== "Customize Transfer";
        setValue("destination", isNumericTransfer ? "seacliff-airport" : "seacliff");
      } else {
        const pickupPointValue =
          charterType === "Dar - Zanzibar (One Way)" || charterType === "Dar-Zanzibar (Two Ways)"
            ? "seacliff-airport"
            : "seacliff";
        setValue("destination", pickupPointValue);
      }
    }
    // For jetski, auto-set destination
    if (selectedCatamaranId === "jetski") {
      setValue("destination", "coastal-waters");
    }
  };

  const handleActivitiesChange = (activity: string, checked: boolean) => {
    const updated = checked
      ? [...selectedActivities, activity]
      : selectedActivities.filter((a) => a !== activity);
    setSelectedActivities(updated);
    setValue("activities", updated);
  };

  const handleNext = async () => {
    if (step === 1) {
      // Step 1: only validate personal details
      const isValid = await trigger(["name", "phone", "date", "passengers"]);
      if (isValid) {
        setStep(2);
      }
    } else if (step === 2) {
      const isSpecialVehicle =
        isHelicopterBoat(selectedCatamaranId) || selectedCatamaranId === "jetski";

      // Departure is required for regular boats (not special vehicles)
      if (!isSpecialVehicle && !selectedDeparture) {
        setDepartureError(true);
        return;
      }
      setDepartureError(false);

      const fieldsToValidate: (keyof BookingForm)[] = isSpecialVehicle
        ? ["charter"]
        : ["destination", "charter"];

      const isValid = await trigger(fieldsToValidate);

      if (isValid) {
        if (isSpecialVehicle) {
          setStep(4);
        } else {
          setStep(3);
        }
      }
    } else if (step === 3) {
      // Step 3: Personal Request (no validation needed, optional fields)
      setStep(4);
    }
  };

  const handleBack = () => {
    setStep((prev) => {
      // Step 4 (order summary) → step 3 (personal requests), preserving all input.
      // For helicopter/jetski there is no step 3, so go to step 2 keeping the catamaran.
      if (prev === 4) {
        const isSpecial =
          isHelicopterBoat(selectedCatamaranId) || selectedCatamaranId === "jetski";
        return isSpecial ? 2 : 3;
      }

      // Step 3 (personal requests) → step 2, keeping catamaran selected.
      if (prev === 3) {
        return 2;
      }

      // Step 2 with a catamaran chosen → unselect catamaran, stay on step 2 list.
      if (prev === 2 && selectedCatamaranId) {
        setSelectedCatamaranId(null);
        return 2;
      }

      // Otherwise, go back one step.
      return Math.max(1, prev - 1);
    });
  };

  const handleSelectCatamaran = (id: string) => {
    const found = catamaranCatalog.find((item) => item.id === id);
    if (found) {
      setSelectedCatamaranId(id);
      setValue("catamaran", found.name);
      setSelectedLocation("");
      setSelectedCharterType("");
      setValue("charter", "");
      setDepartureError(false);

      // For helicopter/jetski, destination is auto-set
      if (isHelicopterBoat(found.id)) {
        setValue("destination", "seacliff");
      } else if (found.id === "jetski") {
        setValue("destination", "coastal-waters");
      } else {
        setValue("destination", "");
      }
    }
  };

  const onSubmit = (data: BookingForm) => {
    // Parse charter selection (format differs for helicopter vs yacht)
    const charterParts = data.charter.split("|");
    const isHelicopter = isHelicopterBoat(selectedCatamaranId);
    const isJetski = selectedCatamaranId === "jetski";
    const isSpecialVehicle = isHelicopter || isJetski;
    const location = charterParts[0];
    const yacht = isSpecialVehicle ? (isHelicopter ? "Helicopter" : "Jet Ski") : charterParts[1];
    const charterType = isSpecialVehicle ? charterParts[1] : charterParts[2];
    
    const charterPackagePriceLine = (() => {
      if (isHelicopter) return getHelicopterPriceForBoat(selectedCatamaranId, charterType);
      if (isJetski) return getJetskiPrice(charterType);
      const parts = data.charter.split("|");
      if (parts.length < 3) return charterType;
      const [loc, y, ct] = parts;
      const { dar, zanzibar } = getYachtPrices(y);
      const opts = loc === "Dar Yacht Charter" ? dar : zanzibar;
      const opt = opts.find((o) => o.type === ct);
      return opt ? `${ct} ${opt.price}` : ct;
    })();

    // Use unicode escape sequences for emojis to avoid encoding issues (showing as �).
    const EMOJI = {
      boatRequest: "🛥️",
      customer: "👤",
      pin: "📍",
      calendar: "📅",
      people: "👥",
      catamaran: "🚤",
      sailboat: "⛵",
      food: "🍽️",
      drink: "🍹",
      music: "🎵",
      warning: "⚠️",
      party: "🎉",
      target: "🎯",
      note: "📝",
      check: "✓",
    } as const;
    
    const catamaranLine = data.catamaran
      ? `\n${EMOJI.catamaran} *Selected Catamaran:*\n${data.catamaran}\n`
      : "";

    const activitiesLine =
      data.activities && data.activities.length
        ? `\n${EMOJI.target} *Preferred Activities:*\n${data.activities.join(", ")}\n`
        : "";

    const otherActivityLine = data.otherActivity
      ? `\n${EMOJI.note} *Other Activity Preferences:*\n${data.otherActivity}\n`
      : "";

    const allergies = data.allergies?.trim();
    const specialOccasion = data.specialOccasion?.trim();
    const showAllergies = !!allergies && allergies.toLowerCase() !== "null";
    const showSpecialOccasion = !!specialOccasion && specialOccasion.toLowerCase() !== "null";

    // Format WhatsApp message
    const message = `
${EMOJI.boatRequest} *NEW YACHT BOOKING REQUEST*

${EMOJI.customer} *Customer Details:*
Name: ${data.name}
Phone: ${data.phone}

${EMOJI.pin} *${isHelicopter ? "Pickup Point" : isJetski ? "Location" : "Route"}:*
${isHelicopter 
  ? helicopterPickupPoints.find((d) => d.value === data.destination)?.label || data.destination
  : isJetski
    ? "Coastal Waters"
    : selectedDeparture === "cruising"
      ? "Sunset Cruise"
      : `${departureOptions.find((d) => d.value === selectedDeparture)?.label || selectedDeparture} → ${Object.values(destinationsByDeparture).flat().find((d) => d.value === data.destination)?.label || data.destination}`}

${EMOJI.calendar} *Date:* ${data.date}
${EMOJI.people} *Passengers:* ${data.passengers}

${catamaranLine}

${EMOJI.sailboat} *Selected ${isHelicopter ? "Helicopter Service" : isJetski ? "Jet Ski Package" : "Charter"}:*
${isSpecialVehicle ? charterType : `${location} - ${yacht}`}
${charterPackagePriceLine}

${!isSpecialVehicle ? `${EMOJI.food} *Food & Drinks:* ${bringOwnFood ? "Customer bringing own food (-$200)" : "Included"}\n${data.foodDrinksRequests?.trim() ? `${EMOJI.food} *Special Food & Drinks Requests:*\n${data.foodDrinksRequests.trim()}\n` : ""}\n${EMOJI.music} *DJ Service:* ${data.dj ? `Yes ${EMOJI.check}` : "No"}\n${isIslandDestinationSelected ? `🎟️ *Marine Ticket (Non-Tanzanian):* ${data.marineTicketNonTanzanian ? `Yes ${EMOJI.check} — ${parseInt(data.passengers) || 1} passenger${(parseInt(data.passengers) || 1) > 1 ? "s" : ""} × TZS 45,000 = TZS ${(45000 * (parseInt(data.passengers) || 1)).toLocaleString()}` : "No"}\n🎟️ *Marine Ticket (Tanzanian):* ${data.marineTicketTanzanian ? `Yes ${EMOJI.check} — ${parseInt(data.passengers) || 1} passenger${(parseInt(data.passengers) || 1) > 1 ? "s" : ""} × TZS 11,800 = TZS ${(11800 * (parseInt(data.passengers) || 1)).toLocaleString()}` : "No"}\n` : ""}` : ""}

${showAllergies ? `${EMOJI.warning} *Allergies:*\n${allergies}\n` : ""}
${showSpecialOccasion ? `${EMOJI.party} *Special Occasion:*\n${specialOccasion}\n` : ""}
${activitiesLine}
${otherActivityLine}

${jetskiAddon && jetskiAddonPackage && !isSpecialVehicle ? `🚤 *Jetski Add-on:* ${jetskiAddonPackage} — ${jetskiAddonPackage === "Half Day" ? "$900" : "$1,500"}\n` : ""}
${(() => {
  const pax = parseInt(data.passengers) || 1;
  const marineTZS =
    (isIslandDestinationSelected && data.marineTicketNonTanzanian ? 45000 * pax : 0) +
    (isIslandDestinationSelected && data.marineTicketTanzanian ? 11800 * pax : 0);
  if (isHelicopter && isHelicopterQuoteOnRequest(selectedCatamaranId, charterType)) {
    return `💰 *Grand Total:* Price on request${marineTZS > 0 ? ` + TZS ${marineTZS.toLocaleString()} (marine ticket)` : ""}\n`;
  }
  if (formattedGrandTotal) {
    return `💰 *Grand Total:* ${formattedGrandTotal}${marineTZS > 0 ? ` + TZS ${marineTZS.toLocaleString()} (marine ticket)` : ""}\n`;
  }
  return "";
})()}
We will confirm your booking shortly.
    `.trim();

    // WhatsApp number
    const whatsappNumber = "255711942057";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    toast({
      title: "Booking Request Sent!",
      description: "We'll contact you shortly with a personalized quote.",
    });
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="min-h-screen flex">
        {/* Left Side - Booking Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-2xl mx-auto w-full">
            {/* Title */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-4xl font-bold mb-2 font-soria drop-shadow-md" style={{ fontSize: 'clamp(2rem, 7vw, 70px)' }}>
                <span className="text-white font-soria">Booking</span>{" "}
                <span className="text-white/90 font-soria">without stress</span>
              </h1>
              {/* Step Indicator */}
              <div className="flex gap-2 mt-3 sm:mt-4">
                <div className={`h-2 flex-1 rounded-full transition-all ${step >= 1 ? "bg-white" : "bg-white/40"}`}></div>
                <div className={`h-2 flex-1 rounded-full transition-all ${step >= 2 ? "bg-white" : "bg-white/40"}`}></div>
                <div className={`h-2 flex-1 rounded-full transition-all ${step >= 3 ? "bg-white" : "bg-white/40"}`}></div>
                <div className={`h-2 flex-1 rounded-full transition-all ${step >= 4 ? "bg-white" : "bg-white/40"}`}></div>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl relative overflow-hidden">
              {/* Form Container with Slide Animation */}
              <div className="relative">
                {/* Step 1: Basic Information */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    step === 1
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-full absolute inset-0 pointer-events-none"
                  }`}
                >
                  <form className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        {...register("name")}
                        className={`bg-white border-gray-200 ${
                          errors.name ? "border-red-500" : ""
                        }`}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+255 XXX XXX XXX"
                        {...register("phone")}
                        className={`bg-white border-gray-200 ${
                          errors.phone ? "border-red-500" : ""
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Date and Passengers Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-gray-700 font-medium">
                          Departure Date *
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          {...register("date")}
                          className={`bg-white border-gray-200 ${
                            errors.date ? "border-red-500" : ""
                          }`}
                        />
                        {errors.date && (
                          <p className="text-sm text-red-500">{errors.date.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="passengers" className="text-gray-700 font-medium">
                          Passengers *
                        </Label>
                        <Input
                          id="passengers"
                          type="number"
                          min="1"
                          placeholder="2"
                          {...register("passengers")}
                          className={`bg-white border-gray-200 ${
                            errors.passengers ? "border-red-500" : ""
                          }`}
                        />
                        {errors.passengers && (
                          <p className="text-sm text-red-500">{errors.passengers.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Next Button */}
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-6 text-lg font-medium"
                    >
                      Next <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </div>

                {/* Step 2: Catalog & Configuration */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    step === 2
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-full absolute inset-0 pointer-events-none"
                  }`}
                >
                  <form className="space-y-4 sm:space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-lg sm:text-xl font-black text-gray-900 font-quicksand">
                        {isHelicopterBoat(selectedCatamaranId) ? "Helicopter" : selectedCatamaranId === "jetski" ? "Jet Ski" : "Yacht Catalog"}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {isHelicopterBoat(selectedCatamaranId)
                          ? "Choose a helicopter service and configure your experience."
                          : selectedCatamaranId === "jetski"
                            ? "Choose a jet ski package and configure your experience."
                            : "Choose a catamaran and configure your experience."}
                      </p>
                    </div>

                    {/* Catalog List */}
                    {!selectedCatamaranId && (
                      <div className="space-y-3 sm:space-y-4">
                        {catamaranCatalog.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectCatamaran(item.id)}
                            className="w-full flex items-center justify-between rounded-xl sm:rounded-2xl bg-white px-2 py-2 sm:px-3 sm:py-3 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="text-left flex-1 min-w-0">
                                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                                  {item.name}
                                </h3>
                                <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Selected catamaran configuration */}
                    {selectedCatamaranId && (
                      <div className="space-y-6">
                        {catamaranCatalog
                          .filter((item) => item.id === selectedCatamaranId)
                          .map((item) => (
                            <div key={item.id} className="space-y-4">
                              {/* Image + description */}
                              <div className="rounded-2xl overflow-hidden bg-white shadow-md">
                                <div className="w-full aspect-[4/3]">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="p-4 space-y-1">
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {item.name}
                                  </h3>
                                  {!isHelicopterBoat(item.id) && item.id !== "jetski" && (
                                    <>
                                      <p className="text-sm text-gray-600">{item.description}</p>
                                      <p className="text-sm font-medium text-gray-800">
                                        Capacity: {item.capacity}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Departure & Destination (only for boats, not helicopter/jetski) */}
                              {!isHelicopterBoat(item.id) && item.id !== "jetski" && (
                                <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                                  <div className="flex flex-col sm:flex-row">
                                    {/* Departure side */}
                                    <div className="flex-1 p-3 sm:p-4 space-y-2">
                                      <Label htmlFor="departure" className="text-base sm:text-xl md:text-[25px] text-gray-700 font-black font-quicksand block">
                                        Departure
                                      </Label>
                                      <Select
                                        onValueChange={(value) => {
                                          setSelectedDeparture(value);
                                          setDepartureError(false);
                                          setValue("destination", "");
                                          setSelectedLocation("");
                                          setSelectedCharterType("");
                                          setValue("charter", "");
                                        }}
                                      >
                                        <SelectTrigger
                                          id="departure"
                                          className={`bg-gray-50 text-sm ${departureError ? "border-red-500 border-2" : "border-gray-200"}`}
                                        >
                                          <SelectValue placeholder="Choose departure" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {departureOptionsForBoat.map((dep) => (
                                            <SelectItem key={dep.value} value={dep.value}>
                                              {dep.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      {departureError && (
                                        <p className="text-sm text-red-500">Please select a departure</p>
                                      )}
                                    </div>

                                    {/* Divider — horizontal on mobile, vertical on sm+ */}
                                    <div className="h-px sm:h-auto sm:w-px bg-gray-200 sm:self-stretch" />

                                    {/* Destination side */}
                                    <div className="flex-1 p-3 sm:p-4 space-y-2">
                                      <Label htmlFor="destination" className="text-base sm:text-xl md:text-[25px] text-gray-700 font-black font-quicksand block">
                                        Destination
                                      </Label>
                                      {selectedDeparture === "cruising" ? (
                                        <p className="text-sm text-blue-500 font-medium pt-2">
                                          Sunset Cruise 🌅
                                        </p>
                                      ) : (
                                        <>
                                          <Select
                                            disabled={!selectedDeparture}
                                            onValueChange={(value) => {
                                              setValue("destination", value);
                                              if (isConstatineBoat(selectedCatamaranId)) {
                                                setSelectedLocation("");
                                                setSelectedCharterType("");
                                                setValue("charter", "");
                                              }
                                            }}
                                          >
                                            <SelectTrigger
                                              id="destination"
                                              className={`bg-gray-50 border-gray-200 text-sm ${
                                                errors.destination ? "border-red-500" : ""
                                              } disabled:opacity-50`}
                                            >
                                              <SelectValue
                                                placeholder={
                                                  selectedDeparture
                                                    ? "Choose destination"
                                                    : "Select departure first"
                                                }
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {destinations.map((dest) => (
                                                <SelectItem key={dest.value} value={dest.value}>
                                                  {dest.label}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                          {errors.destination && (
                                            <p className="text-sm text-red-500">
                                              {errors.destination.message}
                                            </p>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Food Specifications (not for helicopter/jetski) */}
                              {!isHelicopterBoat(item.id) && item.id !== "jetski" && (
                                <div className="space-y-3">
                                  <Label className="text-base sm:text-xl md:text-[25px] text-gray-700 font-black font-quicksand flex items-center gap-2">
                                    <Utensils className="h-4 w-4 sm:h-5 sm:w-5" />
                                    Food specifications
                                  </Label>
                                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200">
                                    <Checkbox
                                      id="bringOwnFood"
                                      checked={bringOwnFood}
                                      onCheckedChange={(checked) => setBringOwnFood(checked === true)}
                                    />
                                    <Label
                                      htmlFor="bringOwnFood"
                                      className="text-sm text-gray-700 cursor-pointer flex-1"
                                    >
                                      I will bring my own food
                                      <span className="ml-1 text-xs text-green-600 font-medium">(-$200)</span>
                                    </Label>
                                  </div>
                                  <div
                                    className={`overflow-hidden transition-all duration-400 ease-in-out ${
                                      bringOwnFood
                                        ? "max-h-0 opacity-0 pointer-events-none"
                                        : "max-h-96 opacity-100"
                                    }`}
                                  >
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2 p-3 rounded-lg bg-white border border-gray-200">
                                        <Utensils className="h-4 w-4 text-gray-500" />
                                        <Wine className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">
                                          Drinks and food included
                                        </span>
                                      </div>
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="foodDrinksRequests"
                                          className="text-gray-700 font-medium"
                                        >
                                          What are your special requests on food and drinks?
                                        </Label>
                                        <textarea
                                          id="foodDrinksRequests"
                                          {...register("foodDrinksRequests")}
                                          rows={3}
                                          placeholder="e.g. vegetarian meals, no shellfish, extra champagne..."
                                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Helicopter, Jetski or Yacht Selection */}
                              {item.id === "jetski" ? (
                                <div className="space-y-4">
                                  <Label className="text-gray-700 font-medium">
                                    Select Jet Ski Package *
                                  </Label>
                                  <div className="space-y-3">
                                    {/* Half Day */}
                                    <button
                                      type="button"
                                      onClick={() => handleCharterSelect("Jet Ski", "Half Day")}
                                      className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                                        selectedCharterType === "Half Day"
                                          ? "bg-gray-900 text-white border-gray-900"
                                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                      }`}
                                    >
                                      <div className="font-semibold mb-2">Half Day</div>
                                      <div className="text-lg font-bold mb-2">$900</div>
                                      <ul className="text-sm space-y-1">
                                        <li>• UP TO 6 HOURS</li>
                                        <li>• 2 PASSENGERS MAXIMUM</li>
                                        <li>• SAFETY EQUIPMENT INCLUDED</li>
                                      </ul>
                                    </button>
                                    {/* Full Day */}
                                    <button
                                      type="button"
                                      onClick={() => handleCharterSelect("Jet Ski", "Full Day")}
                                      className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                                        selectedCharterType === "Full Day"
                                          ? "bg-gray-900 text-white border-gray-900"
                                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                      }`}
                                    >
                                      <div className="font-semibold mb-2">Full Day</div>
                                      <div className="text-lg font-bold mb-2">$1,500</div>
                                      <ul className="text-sm space-y-1">
                                        <li>• UP TO 11 HOURS</li>
                                        <li>• 2 PASSENGERS MAXIMUM</li>
                                        <li>• SAFETY EQUIPMENT INCLUDED</li>
                                      </ul>
                                    </button>
                                  </div>
                                  {errors.charter && !selectedCharterType && (
                                    <p className="text-sm text-red-500">
                                      Please select a jet ski package
                                    </p>
                                  )}
                                </div>
                              ) : isHelicopterBoat(item.id) ? (
                                  <div className="space-y-6">
                                    <Label className="text-gray-700 font-medium">
                                      Select helicopter service *
                                    </Label>
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900 mb-2">Exclusive flight</p>
                                      <div className="space-y-3">
                                        <button
                                          type="button"
                                          onClick={() => handleCharterSelect("Helicopter", "15 Minute Exclusive")}
                                          className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                                            selectedCharterType === "15 Minute Exclusive"
                                              ? "bg-gray-900 text-white border-gray-900"
                                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                          }`}
                                        >
                                          <div className="font-semibold mb-2">15 Minutes</div>
                                          <div className="text-lg font-bold mb-2">$600</div>
                                          <ul className="text-sm space-y-1 opacity-90">
                                            <li>• Scenic flight</li>
                                            <li>• PICKUP: SEACLIFF</li>
                                          </ul>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleCharterSelect("Helicopter", "30 Minute Exclusive")}
                                          className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                                            selectedCharterType === "30 Minute Exclusive"
                                              ? "bg-gray-900 text-white border-gray-900"
                                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                          }`}
                                        >
                                          <div className="font-semibold mb-2">30 Minutes</div>
                                          <div className="text-lg font-bold mb-2">$1,100</div>
                                          <ul className="text-sm space-y-1 opacity-90">
                                            <li>• Scenic flight</li>
                                            <li>• PICKUP: SEACLIFF</li>
                                          </ul>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleCharterSelect("Helicopter", "1 Hour Exclusive")}
                                          className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                                            selectedCharterType === "1 Hour Exclusive"
                                              ? "bg-gray-900 text-white border-gray-900"
                                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                          }`}
                                        >
                                          <div className="font-semibold mb-2">1 Hour</div>
                                          <div className="text-lg font-bold mb-2">$1,950</div>
                                          <ul className="text-sm space-y-1 opacity-90">
                                            <li>• Scenic flight</li>
                                            <li>• PICKUP: SEACLIFF</li>
                                          </ul>
                                        </button>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900 mb-1">Transfer Charter</p>
                                      <p className="text-xs text-gray-600 mb-3">
                                        Go & return, 2 waiting hours included. $400 for each additional hour.
                                      </p>
                                      <div className="space-y-3">
                                        <button
                                          type="button"
                                          onClick={() => handleCharterSelect("Helicopter", "Dar - Zanzibar Transfer")}
                                          className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                                            selectedCharterType === "Dar - Zanzibar Transfer"
                                              ? "bg-gray-900 text-white border-gray-900"
                                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                          }`}
                                        >
                                          <div className="font-semibold mb-2">Dar — Zanzibar</div>
                                          <div className="text-lg font-bold mb-2">$2,400</div>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleCharterSelect("Helicopter", "Dar - Kilimanjaro Transfer")}
                                          className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                                            selectedCharterType === "Dar - Kilimanjaro Transfer"
                                              ? "bg-gray-900 text-white border-gray-900"
                                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                          }`}
                                        >
                                          <div className="font-semibold mb-2">Dar — Kilimanjaro</div>
                                          <div className="text-lg font-bold mb-2">$9,600</div>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleCharterSelect("Helicopter", "Dar - Dodoma Transfer")}
                                          className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                                            selectedCharterType === "Dar - Dodoma Transfer"
                                              ? "bg-gray-900 text-white border-gray-900"
                                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                          }`}
                                        >
                                          <div className="font-semibold mb-2">Dar — Dodoma</div>
                                          <div className="text-lg font-bold mb-2">$8,400</div>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleCharterSelect("Helicopter", "Customize Transfer")}
                                          className={`w-full p-4 rounded-lg text-left border-2 transition-all ${
                                            selectedCharterType === "Customize Transfer"
                                              ? "bg-gray-900 text-white border-gray-900"
                                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                          }`}
                                        >
                                          <div className="font-semibold mb-2">Customize pick up & destination</div>
                                          <div className="text-lg font-bold mb-2">Call +255 741 426 886</div>
                                          <p className="text-sm text-gray-600 mt-1">@flysunbird</p>
                                        </button>
                                      </div>
                                    </div>
                                    {errors.charter && !selectedCharterType && (
                                      <p className="text-sm text-red-500">
                                        Please select a helicopter service
                                      </p>
                                    )}
                                  </div>
                              ) : (
                                <>
                                  {/* Charter packages (yacht type is fixed per catamaran) */}
                                  <div className="space-y-4 animate-fade-in">
                                      <Label className="text-base sm:text-xl md:text-[25px] text-gray-700 font-medium">
                                        Select Charter Package *
                                      </Label>

                                      {/* Dar Prices — only when Dar Slipway or Sunset Cruise selected */}
                                      {(selectedDeparture === "dar-slipway" || selectedDeparture === "cruising") && (
                                        <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                                          <h4 className="font-semibold text-gray-900 mb-1">
                                            {isConstatineBoat(selectedCatamaranId)
                                              ? constatineDarSectionTitle
                                              : "Dar Yacht Charter"}
                                          </h4>
                                          {isConstatineBoat(selectedCatamaranId) &&
                                            selectedDeparture === "cruising" && (
                                              <p className="text-sm text-gray-600 mb-3">
                                                1 hour boat cruise — package price below
                                              </p>
                                            )}
                                          {isConstatineBoat(selectedCatamaranId) &&
                                            selectedDeparture === "dar-slipway" &&
                                            !watched.destination && (
                                              <p className="text-sm text-gray-500 mb-3">
                                                Select a destination to see the exact price for that trip.
                                              </p>
                                            )}
                                          {darCharterPackagesForUi.length > 0 && (
                                            <div
                                              className={
                                                isConstatineBoat(selectedCatamaranId) &&
                                                darCharterPackagesForUi.length <= 1
                                                  ? "grid grid-cols-1 gap-2 max-w-sm"
                                                  : "grid grid-cols-3 gap-2"
                                              }
                                            >
                                              {darCharterPackagesForUi.map((option, index) => (
                                                <button
                                                  key={`${option.type}-${index}`}
                                                  type="button"
                                                  onClick={() =>
                                                    handleCharterSelect("Dar Yacht Charter", option.type)
                                                  }
                                                  className={`p-3 rounded-lg text-sm transition-all ${
                                                    selectedLocation === "Dar Yacht Charter" &&
                                                      selectedCharterType === option.type
                                                      ? "bg-gray-900 text-white"
                                                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                                  }`}
                                                >
                                                  <div className="font-medium">{option.type}</div>
                                                  <div
                                                    key={`dar-${index}-${String(bringOwnFood)}`}
                                                    className="text-xs mt-1 font-semibold animate-price-flash"
                                                  >
                                                    {displayPrice(option.price)}
                                                  </div>
                                                </button>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* Zanzibar Prices — only when Znz Hotel Verde or Sunset Cruise selected (not CONSTATINE — Dar only) */}
                                      {(selectedDeparture === "znz-hotel-verde" || selectedDeparture === "cruising") &&
                                        !isConstatineBoat(selectedCatamaranId) && (
                                        <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                                          <h4 className="font-semibold text-gray-900 mb-3">
                                            Zanzibar Charter
                                          </h4>
                                          <div className="grid grid-cols-3 gap-2">
                                            {yachtPrices.zanzibar.map((option, index) => (
                                              <button
                                                key={index}
                                                type="button"
                                                onClick={() =>
                                                  handleCharterSelect("Zanzibar Charter", option.type)
                                                }
                                                className={`p-3 rounded-lg text-sm transition-all ${
                                                  selectedLocation === "Zanzibar Charter" &&
                                                    selectedCharterType === option.type
                                                    ? "bg-gray-900 text-white"
                                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                                }`}
                                              >
                                                <div className="font-medium">{option.type}</div>
                                                <div
                                                  key={`zan-${index}-${String(bringOwnFood)}`}
                                                  className="text-xs mt-1 font-semibold animate-price-flash"
                                                >
                                                  {displayPrice(option.price)}
                                                </div>
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {errors.charter && !selectedLocation && (
                                        <p className="text-sm text-red-500">
                                          Please select a charter package
                                        </p>
                                      )}
                                  </div>
                                </>
                              )}


                              {/* DJ Option (not for helicopter/jetski) */}
                              {!isHelicopterBoat(item.id) && item.id !== "jetski" && (
                                <div className="space-y-2">
                                  <Label className="text-base sm:text-xl md:text-[25px] text-gray-700 font-semibold flex items-center gap-2">
                                    <Music className="h-4 w-4 sm:h-5 sm:w-5" />
                                    Additional cost
                                  </Label>
                                  <div className="p-4 rounded-lg bg-white border border-gray-200">
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <Music className="h-5 w-5 text-gray-700" />
                                          <div>
                                            <Label
                                              htmlFor="dj"
                                              className="text-gray-700 font-medium cursor-pointer"
                                            >
                                              Professional DJ Service
                                            </Label>
                                            <p className="text-xs text-gray-500">
                                              Add music entertainment
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <span className="text-sm font-semibold text-gray-700">+$150</span>
                                          <Switch
                                            id="dj"
                                            checked={djEnabled}
                                            onCheckedChange={(checked) => {
                                              setDjEnabled(checked);
                                              setValue("dj", checked);
                                            }}
                                          />
                                        </div>
                                      </div>

                                      {isIslandDestinationSelected && (
                                        <>
                                          <div className="h-px bg-gray-200" />
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                              <Anchor className="h-5 w-5 text-gray-700" />
                                              <div>
                                                <Label
                                                  htmlFor="marine-ticket-non-tanzanian"
                                                  className="text-gray-700 font-medium cursor-pointer"
                                                >
                                                  Marine Ticket (Non-Tanzanian)
                                                </Label>
                                                <p className="text-xs text-gray-500">
                                                  Apply for island destinations only
                                                </p>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                              <div className="text-right">
                                                <span className="text-sm font-semibold text-gray-700">TZS {(45000 * (parseInt(watched.passengers) || 1)).toLocaleString()}</span>
                                                <p className="text-xs text-gray-500">{parseInt(watched.passengers) || 1} passenger{(parseInt(watched.passengers) || 1) > 1 ? "s" : ""} × TZS 45,000</p>
                                              </div>
                                              <Switch
                                                id="marine-ticket-non-tanzanian"
                                                checked={marineTicketNonTanzanian}
                                                onCheckedChange={(checked) => {
                                                  setMarineTicketNonTanzanian(checked);
                                                  setValue("marineTicketNonTanzanian", checked);
                                                }}
                                              />
                                            </div>
                                          </div>

                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                              <Anchor className="h-5 w-5 text-gray-700" />
                                              <div>
                                                <Label
                                                  htmlFor="marine-ticket-tanzanian"
                                                  className="text-gray-700 font-medium cursor-pointer"
                                                >
                                                  Marine Ticket (Tanzanian)
                                                </Label>
                                                <p className="text-xs text-gray-500">
                                                  Apply for island destinations only
                                                </p>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                              <div className="text-right">
                                                <span className="text-sm font-semibold text-gray-700">TZS {(11800 * (parseInt(watched.passengers) || 1)).toLocaleString()}</span>
                                                <p className="text-xs text-gray-500">{parseInt(watched.passengers) || 1} passenger{(parseInt(watched.passengers) || 1) > 1 ? "s" : ""} × TZS 11,800</p>
                                              </div>
                                              <Switch
                                                id="marine-ticket-tanzanian"
                                                checked={marineTicketTanzanian}
                                                onCheckedChange={(checked) => {
                                                  setMarineTicketTanzanian(checked);
                                                  setValue("marineTicketTanzanian", checked);
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
 
                              {/* Jetski Add-on (not for helicopter or jetski) */}
                              {!isHelicopterBoat(item.id) && item.id !== "jetski" && (
                                <div className="space-y-2">
                                  <div className="p-4 rounded-lg bg-white border border-gray-200">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <Waves className="h-5 w-5 text-gray-700" />
                                        <div>
                                          <Label htmlFor="jetski-addon" className="text-gray-700 font-medium cursor-pointer">
                                            Add Jetski
                                          </Label>
                                          <p className="text-xs text-gray-500">Include a jet ski to your charter</p>
                                        </div>
                                      </div>
                                      <Switch
                                        id="jetski-addon"
                                        checked={jetskiAddon}
                                        onCheckedChange={(checked) => {
                                          setJetskiAddon(checked);
                                          if (!checked) setJetskiAddonPackage("");
                                        }}
                                      />
                                    </div>

                                    {/* Package selection — slides in when toggled */}
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${jetskiAddon ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
                                      <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Select Jetski Package</p>
                                      <div className="flex gap-3">
                                        {[
                                          { label: "Half Day", price: "$900", hours: "6 hrs" },
                                          { label: "Full Day", price: "$1,500", hours: "10 hrs" },
                                        ].map((pkg) => (
                                          <button
                                            key={pkg.label}
                                            type="button"
                                            onClick={() => setJetskiAddonPackage(pkg.label)}
                                            className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                              jetskiAddonPackage === pkg.label
                                                ? "bg-gray-900 text-white border-gray-900"
                                                : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400"
                                            }`}
                                          >
                                            <div>{pkg.label}</div>
                                            <div className="font-bold">{pkg.price}</div>
                                            <div className="text-xs opacity-70">{pkg.hours}</div>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="flex-1 rounded-full py-6 text-lg font-medium border-gray-300"
                      >
                        <ChevronLeft className="mr-2 h-5 w-5" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-full py-6 text-lg font-medium"
                        disabled={!selectedCatamaranId}
                      >
                        Next
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Step 3: Personal Request */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    step === 3
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-full absolute inset-0 pointer-events-none"
                  }`}
                >
                  <form className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-gray-900 font-spartan">Personal Request</h2>
                      <p className="text-sm text-gray-500">
                        Share any special requirements or preferences for your booking.
                      </p>
                    </div>

                    {/* Activities / Experiences */}
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-medium">
                        What activities or experiences are important to you during your charter?
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-3">
                          {activityOptions.slice(0, 4).map((activity) => (
                            <div
                              key={activity}
                              className="flex items-center space-x-2 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                            >
                              <Checkbox
                                id={activity}
                                checked={selectedActivities.includes(activity)}
                                onCheckedChange={(checked) =>
                                  handleActivitiesChange(activity, checked as boolean)
                                }
                              />
                              <Label
                                htmlFor={activity}
                                className="text-sm text-gray-700 cursor-pointer flex-1"
                              >
                                {activity}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-3">
                          {activityOptions.slice(4, 8).map((activity) => (
                            <div
                              key={activity}
                              className="flex items-center space-x-2 p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                            >
                              <Checkbox
                                id={activity}
                                checked={selectedActivities.includes(activity)}
                                onCheckedChange={(checked) =>
                                  handleActivitiesChange(activity, checked as boolean)
                                }
                              />
                              <Label
                                htmlFor={activity}
                                className="text-sm text-gray-700 cursor-pointer flex-1"
                              >
                                {activity}
                              </Label>
                            </div>
                          ))}
                          {/* Other activity text field */}
                          <div className="space-y-2">
                            <Label htmlFor="otherActivity" className="text-sm text-gray-700 font-medium">
                              Other (please specify)
                            </Label>
                            <Input
                              id="otherActivity"
                              placeholder="Tell us about any other activities you’d like"
                              {...register("otherActivity")}
                              className="bg-white border-gray-200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Allergies */}
                    <div className="space-y-2">
                      <Label htmlFor="allergies" className="text-gray-700 font-medium">
                        What are your allergies?
                      </Label>
                      <Input
                        id="allergies"
                        placeholder="E.g., Nuts, Shellfish, Dairy"
                        {...register("allergies")}
                        className="bg-white border-gray-200"
                      />
                    </div>

                    {/* Special Occasion */}
                    <div className="space-y-2">
                      <Label htmlFor="specialOccasion" className="text-gray-700 font-medium">
                        Special occasion
                      </Label>
                      <Input
                        id="specialOccasion"
                        placeholder="E.g., Valentines, Birthday, Anniversary"
                        {...register("specialOccasion")}
                        className="bg-white border-gray-200"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="flex-1 rounded-full py-6 text-lg font-medium border-gray-300"
                      >
                        <ChevronLeft className="mr-2 h-5 w-5" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-full py-6 text-lg font-medium"
                      >
                        Next
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Step 4: Order Summary */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    step === 4
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-full absolute inset-0 pointer-events-none"
                  }`}
                >
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-gray-900 font-spartan">Order Summary</h2>
                      <p className="text-sm text-gray-500">
                        Review your details before sending your booking request.
                      </p>
                    </div>

                    {/* Guest details */}
                    <div className="rounded-2xl bg-white p-4 shadow-sm space-y-2">
                      <h3 className="text-sm font-semibold text-gray-900">Guest details</h3>
                      <p className="text-sm text-gray-700">
                        {watched.name || "Name not provided"}
                      </p>
                      <p className="text-sm text-gray-700">
                        {watched.phone || "Phone not provided"}
                      </p>
                      <p className="text-sm text-gray-700">
                        Date: {watched.date || "Not selected"}
                      </p>
                      <p className="text-sm text-gray-700">
                        Passengers: {watched.passengers || "Not set"}
                      </p>
                    </div>

                    {/* Yacht & catalog */}
                    <div className="rounded-2xl bg-white p-4 shadow-sm space-y-2">
                      <h3 className="text-sm font-semibold text-gray-900">Yacht & destination</h3>
                      <p className="text-sm text-gray-700">
                        Catamaran: {watched.catamaran || "Not selected"}
                      </p>
                      {isHelicopterBoat(selectedCatamaranId) ? (
                        <p className="text-sm text-gray-700">
                          Pickup Point:{" "}
                          {watched.destination
                            ? helicopterPickupPoints.find((d) => d.value === watched.destination)?.label
                            : "Not selected"}
                        </p>
                      ) : selectedCatamaranId === "jetski" ? (
                        <p className="text-sm text-gray-700">Location: Coastal Waters</p>
                      ) : (
                        <>
                          <p className="text-sm text-gray-700">
                            Departure:{" "}
                            {selectedDeparture
                              ? departureOptions.find((d) => d.value === selectedDeparture)?.label
                              : "Not selected"}
                          </p>
                          <p className="text-sm text-gray-700">
                            Destination:{" "}
                            {selectedDeparture === "cruising"
                              ? "Sunset Cruise"
                              : watched.destination
                                ? Object.values(destinationsByDeparture).flat().find((d) => d.value === watched.destination)?.label
                                : "Not selected"}
                          </p>
                        </>
                      )}
                      <p className="text-sm text-gray-700">
                        Charter: {watched.charter || "Not selected"}
                      </p>
                    </div>

                    {/* Jetski Add-on summary */}
                    {jetskiAddon &&
                      jetskiAddonPackage &&
                      !isHelicopterBoat(selectedCatamaranId) &&
                      selectedCatamaranId !== "jetski" && (
                      <div className="rounded-2xl bg-white p-4 shadow-sm space-y-1">
                        <h3 className="text-sm font-semibold text-gray-900">Jetski Add-on</h3>
                        <p className="text-sm text-gray-700">
                          {jetskiAddonPackage} — {jetskiAddonPackage === "Half Day" ? "$900" : "$1,500"}
                        </p>
                      </div>
                    )}

                    {/* Food & extras (not for helicopter/jetski) */}
                    {!isHelicopterBoat(selectedCatamaranId) && selectedCatamaranId !== "jetski" && (
                      <div className="rounded-2xl bg-white p-4 shadow-sm space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900">Services</h3>
                        <p className="text-sm text-gray-700">
                          Food:{" "}
                          {watched.food && watched.food.length
                            ? watched.food.join(", ")
                            : "Included & covered by Yacht Dealers"}
                        </p>
                        <p className="text-sm text-gray-700">
                          Drinks:{" "}
                          {watched.drinks && watched.drinks.length
                            ? watched.drinks.join(", ")
                            : "Included & covered by Yacht Dealers"}
                        </p>
                        <p className="text-sm text-gray-700">
                          DJ service: {watched.dj ? "Yes" : "No"}
                        </p>
                        {isIslandDestinationSelected && (
                          <>
                            <p className="text-sm text-gray-700">
                              Marine ticket (Non-Tanzanian):{" "}
                              {watched.marineTicketNonTanzanian
                                ? `${parseInt(watched.passengers) || 1} passenger${(parseInt(watched.passengers) || 1) > 1 ? "s" : ""} × TZS 45,000 = TZS ${(45000 * (parseInt(watched.passengers) || 1)).toLocaleString()}`
                                : "No"}
                            </p>
                            <p className="text-sm text-gray-700">
                              Marine ticket (Tanzanian):{" "}
                              {watched.marineTicketTanzanian
                                ? `${parseInt(watched.passengers) || 1} passenger${(parseInt(watched.passengers) || 1) > 1 ? "s" : ""} × TZS 11,800 = TZS ${(11800 * (parseInt(watched.passengers) || 1)).toLocaleString()}`
                                : "No"}
                            </p>
                          </>
                        )}
                        {watched.foodDrinksRequests?.trim() && (
                          <p className="text-sm text-gray-700">
                            Special food & drinks requests: {watched.foodDrinksRequests.trim()}
                          </p>
                        )}
                        {(watched.activities && watched.activities.length > 0) && (
                          <p className="text-sm text-gray-700">
                            Preferred activities: {watched.activities.join(", ")}
                          </p>
                        )}
                        {watched.otherActivity && (
                          <p className="text-sm text-gray-700">
                            Other activity preferences: {watched.otherActivity}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Grand total */}
                    {(formattedGrandTotal || isHelicopterSpecialCharter) && (
                      <div className="rounded-2xl bg-gray-900 p-4 shadow-sm">
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-white">Grand total</h3>
                          {isHelicopterSpecialCharter ? (
                            <p className="text-lg font-bold text-white">Price on request</p>
                          ) : (
                            <>
                              {!isHelicopterBoat(selectedCatamaranId) &&
                                selectedCatamaranId !== "jetski" &&
                                baseCharterPrice > 0 && (
                                  <div className="space-y-1 text-xs text-gray-400">
                                    <p>Charter subtotal: ${baseCharterPrice.toLocaleString()}</p>
                                    {bringOwnFood && (
                                      <p className="text-green-400">−$200 (bringing own food)</p>
                                    )}
                                    {djEnabled && <p className="text-gray-300">+$150 (DJ service)</p>}
                                    {jetskiAddonAmount > 0 && (
                                      <p className="text-gray-300">
                                        +${jetskiAddonAmount.toLocaleString()} (jetski add-on)
                                      </p>
                                    )}
                                    {isIslandDestinationSelected && watched.marineTicketNonTanzanian && (
                                      <p className="text-gray-300">
                                        +TZS {(45000 * (parseInt(watched.passengers) || 1)).toLocaleString()} ({parseInt(watched.passengers) || 1} passenger{(parseInt(watched.passengers) || 1) > 1 ? "s" : ""} × TZS 45,000 marine ticket)
                                      </p>
                                    )}
                                    {isIslandDestinationSelected && watched.marineTicketTanzanian && (
                                      <p className="text-gray-300">
                                        +TZS {(11800 * (parseInt(watched.passengers) || 1)).toLocaleString()} ({parseInt(watched.passengers) || 1} passenger{(parseInt(watched.passengers) || 1) > 1 ? "s" : ""} × TZS 11,800 marine ticket)
                                      </p>
                                    )}
                                  </div>
                                )}
                              {(isHelicopterBoat(selectedCatamaranId) ||
                                selectedCatamaranId === "jetski") &&
                                baseCharterPrice > 0 && (
                                  <p className="text-xs text-gray-400">
                                    Package: ${baseCharterPrice.toLocaleString()}
                                  </p>
                                )}
                              <div className="flex items-center justify-between pt-2 border-t border-white/15">
                                <span className="text-sm font-medium text-white/90">Amount due</span>
                                <div className="text-right">
                                  {(() => {
                                    const pax = parseInt(watched.passengers) || 1;
                                    const marineTZS =
                                      (isIslandDestinationSelected && watched.marineTicketNonTanzanian ? 45000 * pax : 0) +
                                      (isIslandDestinationSelected && watched.marineTicketTanzanian ? 11800 * pax : 0);
                                    return marineTZS > 0 ? (
                                      <>
                                        <span className="text-2xl font-bold text-white">{formattedGrandTotal}</span>
                                        <span className="text-lg font-bold text-gray-300"> + TZS {marineTZS.toLocaleString()}</span>
                                      </>
                                    ) : (
                                      <span className="text-2xl font-bold text-white">{formattedGrandTotal}</span>
                                    );
                                  })()}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Personal Requests */}
                    {(watched.allergies || watched.specialOccasion) && (
                      <div className="rounded-2xl bg-white p-4 shadow-sm space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900">Personal Requests</h3>
                        {watched.allergies && (
                          <p className="text-sm text-gray-700">
                            Allergies: {watched.allergies}
                          </p>
                        )}
                        {watched.specialOccasion && (
                          <p className="text-sm text-gray-700">
                            Special Occasion: {watched.specialOccasion}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 pt-2">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="flex-1 rounded-full py-6 text-lg font-medium border-gray-300"
                      >
                        <ChevronLeft className="mr-2 h-5 w-5" />
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-full py-6 text-lg font-medium"
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Send booking
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image with Creative Overlays */}
        <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }}>
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/40" aria-hidden />
          
          {/* Floating Wave Decorations */}
          <div className="absolute top-20 right-10 w-32 h-32 text-white/20 animate-float">
            <Waves className="w-full h-full" />
          </div>
          <div className="absolute bottom-32 left-16 w-24 h-24 text-white/20 animate-float-delayed">
            <Waves className="w-full h-full rotate-180" />
          </div>
          
          {/* Floating Anchor Icon */}
          <div className="absolute top-40 left-20 w-16 h-16 text-white/30 animate-float-slow">
            <Anchor className="w-full h-full" />
          </div>
          
          {/* Floating Sparkles */}
          <div className="absolute top-1/3 right-32 w-12 h-12 text-yellow-400/50 animate-float">
            <Sparkles className="w-full h-full" />
          </div>
          <div className="absolute bottom-1/3 left-24 w-10 h-10 text-white/30 animate-float-delayed">
            <Sparkles className="w-full h-full" />
          </div>
          
          {/* Image Container with Enhanced Styling */}
          <div className="relative h-full flex items-center justify-center p-12">
            <div className="relative z-10 w-full max-w-lg">
              {/* Image with Glow Effect */}
              <div className="relative group">
                {/* Glow Effect Behind Image */}
                <div className="absolute -inset-4 bg-gradient-to-r from-gray-400/20 via-gray-400/20 to-gray-400/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                
                {/* Main Image - Slideshow (fully automatic, no manual controls) */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500 w-full aspect-[16/9]">
                  <img
                    src={bookingImages[currentImageIndex]}
                    alt="Luxury Yacht"
                    className="w-full h-full object-cover transition-opacity duration-700"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                </div>
                
                {/* Floating Feature Badges */}
                <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2 animate-float-slow">
                  <Sparkles className="w-4 h-4 text-gray-900" />
                  <span className="text-sm font-semibold text-gray-800">Luxury Experience</span>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2 animate-float-delayed">
                  <Ship className="w-4 h-4 text-gray-900" />
                  <span className="text-sm font-semibold text-gray-800">Premium Fleet</span>
                </div>
              </div>
              
              {/* Inspirational Text Overlay */}
              <div className="mt-8 text-center animate-fade-in">
                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">
                  Sail Into Luxury
                </h3>
                <p className="text-white/95 text-sm drop-shadow">
                  Experience unforgettable moments on pristine waters
                </p>
              </div>
              
              {/* Decorative Dots */}
              <div className="absolute top-1/4 left-8 flex flex-col gap-4">
                <div className="w-3 h-3 rounded-full bg-white/40 animate-ping"></div>
                <div className="w-2 h-2 rounded-full bg-white/40 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white/30 animate-ping" style={{ animationDelay: '1s' }}></div>
              </div>
              
              <div className="absolute bottom-1/4 right-8 flex flex-col gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-white/40 animate-ping" style={{ animationDelay: '1.5s' }}></div>
                <div className="w-3 h-3 rounded-full bg-white/40 animate-ping" style={{ animationDelay: '2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-white/30 animate-ping" style={{ animationDelay: '2.5s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
