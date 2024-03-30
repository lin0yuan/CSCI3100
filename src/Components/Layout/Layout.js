import Menu from '../Menus/Menu/Menu'
import MenuDown from '../Menus/MenuDown/MenuDown'
import Trends from '../Trends/Trends'

import './Layout.scss'

const Layout = ({ children }) => {
	return (
		<div className="Layout__container">
			<div className="container__content">
				<div className="container__menu">
					<Menu />
				</div>
				<div className="content__main">
					<section className="Content__page">
						{children}
					</section>
					<div className="container__trends">
						<Trends />
					</div>
				</div>
				<div className="container__MenuDown">
					<MenuDown />
				</div>
			</div>
		</div>
	)
}

export default Layout
