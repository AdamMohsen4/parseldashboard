
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="flex items-center">
      <Link to="/">
        <h1 className="text-2xl font-bold text-primary">E-Parsel</h1>
      </Link>
      <span className="ml-2 text-sm bg-accent/10 text-accent px-2 py-0.5 rounded-full">SME Portal</span>
    </div>
  );
};

export default Logo;
