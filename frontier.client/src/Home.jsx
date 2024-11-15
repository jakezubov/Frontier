import { useEffect } from 'react'
import { useCurrentPage } from './contexts/CurrentPageContext'

const Home = () => {
    const { setCurrentPage, Pages } = useCurrentPage()

    useEffect(() => {
        setCurrentPage(Pages.HOME)
    }, [])

    return (
        <div>
            <h1>Jewellery Calculation Suite</h1>
            <p>By Jake Zubov</p>
            <p>Zubov Innovations</p>
        </div>
    );
}

export default Home;