import PropTypes from 'prop-types'
import { useState } from 'react'

const HoverText = ({ text, children }) => {
    const [showText, setShowText] = useState(false);

    let timer;

    const onHover = () => {
        timer = setTimeout(() => {
            setShowText(true)
        }, 1000) // 1000 milliseconds = 1 second
    }

    const onLeave = () => {
        clearTimeout(timer)
        setShowText(false)
    }

    return (
        <div onMouseEnter={onHover} onMouseLeave={onLeave} className="hover-text-container" onTouchStart={onHover} onTouchEnd={onLeave} onClick={onLeave}>
            {showText && <div className="hover-text">{text}</div>}
            {children}
        </div>
    )
}

HoverText.propTypes = {
    text: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
}

export default HoverText