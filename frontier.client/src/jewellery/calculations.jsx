import { useEffect } from 'react'
import { useCurrentPage } from '../contexts/current-page-context'
import 'katex/dist/katex.min.css'
import katex from 'katex'

const Calculations = () => {
    const { setCurrentPage, Pages } = useCurrentPage()
    const formulas = {
        metalConverter: [
            '\\text{New Weight} = \\dfrac{\\text{New Specific Gravity}}{\\text{Original Specific Gravity}} \\times \\text{Original Weight}',
        ],
        ringWeight: [
            '\\text{Ring Weight} = \\left(\\text{Width} \\times \\text{Thickness} \\times \\pi \\times \\text{Diameter} \\right) \\times \\text{Specific Gravity}',
        ],
        ringResizer: [
            '\\text{New Weight} = \\left(\\text{Width} \\times \\text{Thickness} \\times \\pi \\times \\text{Diameter} \\right) \\times \\text{Specific Gravity}',
            '\\text{Original Weight} = \\left(\\text{Width} \\times \\text{Thickness} \\times \\pi \\times \\text{Diameter} \\right) \\times \\text{Specific Gravity}',
            '\\text{Weight Difference} = \\text{New Weight} - \\text{Original Weight}',
        ],
        rollwingWire: [
            '\\text{Side Length} = \\left(\\text{Width}^2 \\times \\text{Thickness} \\right)^{\\frac{1}{3}}',
            '\\text{Length} = \\dfrac{\\text{Length} \\times \\text{Width} \\times \\text{Thickness}}{\\text{Side}^{2}}',
            '\\text{Diameter} = \\dfrac{ 2 \\times \\text{Side}}{\\sqrt{\\pi}}',
            '\\text{Stock Length} = \\dfrac { 4 \\times \\text{Side}^2 \\times \\text{Length}}{\\pi \\times \\text{Stock Size}^2}',
            '\\text{Stock Length} = \\dfrac {\\text{Side}^2 \\times \\text{Length}}{\\text{Stock Size}^2}',
        ],
    }

    useEffect(() => {
        setCurrentPage(Pages.CALCULATIONS)

        Object.keys(formulas).forEach((section) => {
            formulas[section].forEach((formula, index) => {
                const elementId = `${section}-${index}`
                const element = document.getElementById(elementId)
                katex.render(formula, element, {
                    throwOnError: false,
                })
                element.style.zIndex = '0'
            })
        })
    }, [])

    return (
        <div>
            <h1>Calculations</h1>

            <table className="calculation-table">
                <tbody>
                    <tr>
                        <td>
                            <h3>Metal Converter Calculation</h3>
                            {formulas.metalConverter.map((_, index) => (
                                <p id={`metalConverter-${index}`} key={index}></p>
                            ))}
                        </td>
                        <td rowSpan="3">
                            <h3>Rolling Wire Calculation</h3>
                            <p id="rollwingWire-0"></p>
                            <p id="rollwingWire-1"></p>

                            <h5 className="tight-bottom"><i>If Profile is Round:</i></h5>
                            <p id="rollwingWire-2"></p>

                            <h5 className="tight-bottom"><i>If starting with Round Stock:</i></h5>
                            <p id="rollwingWire-3"></p>

                            <h5 className="tight-bottom"><i>If starting with Square Stock:</i></h5>
                            <p id="rollwingWire-4"></p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3>Ring Weight Calculation</h3>
                            {formulas.ringWeight.map((_, index) => (
                                <p id={`ringWeight-${index}`} key={index}></p>
                            ))}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3>Ring Resizer Calculation</h3>
                            {formulas.ringResizer.map((_, index) => (
                                <p id={`ringResizer-${index}`} key={index}></p>
                            ))}
                        </td>
                    </tr>
                    <tr>
                        
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Calculations