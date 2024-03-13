import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import MetalConverter from './Jewellery/MetalConverter';
import RingWeight from './Jewellery/RingWeight';
import RingResizer from './Jewellery/RingResizer';
import RollingWire from './Jewellery/RollingWire';


const App = () => {
    const metalConverterPath = "/Jewellery/MetalConverter"
    const ringWeightPath = "/Jewellery/RingWeight"
    const ringResizerPath = "/Jewellery/RingResizer"
    const rollingWirePath = "/Jewellery/RollingWire"

    return (
        <Router>
            <div>
                <nav className="navbar">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to={metalConverterPath}>Metal Converter</Link></li>
                        <li><Link to={ringWeightPath}>Ring Weight</Link></li>
                        <li><Link to={ringResizerPath}>Ring Resizer</Link></li>
                        <li><Link to={rollingWirePath}>Rolling Wire</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path={metalConverterPath} element={<MetalConverter />} />
                    <Route path={ringWeightPath} element={<RingWeight />} />
                    <Route path={ringResizerPath} element={<RingResizer />} />
                    <Route path={rollingWirePath} element={<RollingWire />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;