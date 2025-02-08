import servicesData from "../data/servicesData";

export default function Services() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Services</h2>
      <ul>
        {servicesData.map((service, index) => (
          <li key={index} className="p-4 shadow-lg mb-2 bg-white rounded-lg">
            <h3 className="text-lg font-semibold">{service.name}</h3>
            <p className="text-gray-600">{service.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}