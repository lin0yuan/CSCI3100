import React, { createContext, useEffect, useState } from 'react'
import { getAllPost, myGetUser } from '../Services/api'

export const AppContext = createContext({})

const AppProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [posts, setPosts] = useState(null)
	const initialState = {
		user, setUser,
		posts, setPosts
	}

	useEffect(() => {
		const fetch = async () => {
			if (!localStorage.getItem('userTwitterClone') && !window.location.href.endsWith('/')) {
				//window.location.href = '/'
				return
			} else {
				if (localStorage.getItem('userTwitterClone')) {
					setUser(await myGetUser(localStorage.getItem('userTwitterClone')))
					// setUser(await myGetUser(userID))
					setPosts(await getAllPost())
				}
			}
		}
		fetch()
	}, [])

	return (
		<AppContext.Provider value={initialState} >
			{children}
		</AppContext.Provider>
	)
}

export default AppProvider