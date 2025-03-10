import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const EventCard: React.FC = ({ name, description, time }) => {
  return (
    <div className="hover:scale-[101%] bg-white transform transition-all duration-500  text-gray-900 rounded-lg shadow-md p-6 flex flex-col justify-between">
      <h2 className="mb-2 text-xl font-bold">{name}</h2>
      <p className="mb-4 text-gray-600">{description}</p>
      <div className="flex items-center justify-between">
        <div>
          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
          <p className="text-sm font-bold text-gray-600">{time}</p>
        </div>
        <button className="px-4 py-2 text-sm font-bold text-white transition duration-300 bg-black rounded-md hover:bg-gray-800">
          Register
        </button>
      </div>
    </div>
  );
};

export default EventCard;
