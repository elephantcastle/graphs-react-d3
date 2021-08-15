import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <ul className="header">
        <li>
          <Link to="/scatterplot">scatterplot</Link>
        </li>
        <li>
          <Link to="/linechart">linechart</Link>
        </li>
        <li>
          <Link to="/barchart">barchart</Link>
        </li>
        <li>
          <Link to="/groupedandstackedchart">groupedandstackedchart</Link>
        </li>
        <li>
          <Link to="/boxplot">boxplot</Link>
        </li>
        <li>
          <Link to="/mapchart">mapchart</Link>
        </li>
        <li>
          <Link to="/globe">Globe</Link>
        </li>
        <li>
          <Link to="/hexbin">hexbin</Link>
        </li>
        <li>
          <Link to="/sankey">sankey</Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;
