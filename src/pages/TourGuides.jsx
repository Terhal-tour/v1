import TourGuideCard from "../components/TourGuideCard";

const mockTourGuides = [
  {
    id: 1,
    name: "Ahmed Mostafa",
    bio: "Experienced tour guide specializing in ancient Egyptian history.",
    location: "Cairo, Egypt",
    languages: ["Arabic", "English", "French"],
    rating: 4,
    photo: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    id: 2,
    name: "Sara Youssef",
    bio: "Passionate about Islamic Cairo and local street food.",
    location: "Giza, Egypt",
    languages: ["Arabic", "English"],
    rating: 5,
    photo: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

const TourGuides = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Meet Our Tour Guides</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTourGuides.map((guide) => (
            <TourGuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourGuides;
