import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import MetalConverter from './MetalConverter';
import RingResizer from './RingResizer';

const App = () => {
    const metalConverterPath = "/MetalConverter"
    const ringResizerPath = "/RingResizer"

    return (
        <Router>
            <div>
                <nav className="navbar">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to={metalConverterPath}>Metal Converter</Link></li>
                        <li><Link to={ringResizerPath}>Ring Resizer</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path={metalConverterPath} element={<MetalConverter />} />
                    <Route path={ringResizerPath} element={<RingResizer />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;