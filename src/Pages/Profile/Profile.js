import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MichealAvatar from './michaelAvatar.png'
import MichealBG from './MichaelWorking.png'
import { AppContext } from '../../Context/AppContext'
import './Profile.scss'
// import cartContex from _app.js
// import { cartContext } from _app.js

import NavProfile from '../../Components/NavPages/NavProfile/NavProfile'
import MenuTweetsProfile from '../../Components/Menus/MenuTweetsProfile/MenuTweetsProfile'
import TweetPost from '../../Components/Tweet/TweetPost/TweetPost'

import { myGetUserPosts } from '../../Services/api'

const profileData = {
	user_photo: MichealAvatar,
	image_bg: MichealBG,
	name: 'Michael',
	username: 'Michael',
	description: 'I would like to offer you a coupon if you follow me!',
	count_tweets: 1500,
	following: 500,
	followers: 1000
}
  
const sampleUserData = {
	username: 'Michael',
	name: 'Michael',
	bio: 'Software Developer | CUHK Professor',
	avatar: 'https://example.com/avatar.jpg',
	// Add more properties as needed
}
const samplePostsData = [
	{
	  id: 1,
	  user_photo: MichealAvatar,
	  username: 'Michael',
	  content: 'I want to offer 5 coupons to group E4!'
	},
	{
	  id: 2,
	  user_photo: MichealAvatar,
	  username: 'Michael',
	  content: 'Just testing out this new feature!'
	}
]
const Profile = () => {

	const appContext = useContext(AppContext)
	const [posts, setPosts] = useState(null)
	const [isFollowing, setIsFollowing] = useState(false)
	const { userID } = useParams() // fetch the passed-in userID parameters from the search path

	useEffect(() => {
		console.log(userID)
		if (userID) {
			fetch(`http://localhost:3001/profilePosts/${userID}`)
				.then((response) => {
					if (!response.ok) {
						throw new Error('Network response was not ok')
					}
					return response.json()
				})
				.then((data) => {
					setPosts(data)
					console.log(data)
				})
				.catch((error) => {
					console.error('Error fetching user data:', error)
				})
		} else {
			console.warn('用户ID不可用')
		}
	  }, [])

	const handleButtonClick = () => {
		setIsFollowing(prevState => !prevState)
	  }
	
	return (
		<div className="profile__container">
			{appContext?.user &&
				<>
					<NavProfile 
					 user={appContext?.user} 
					 userID = {appContext?.user.userID}
					 isFollowing={isFollowing}
					 handleButtonClick={handleButtonClick}
					//  user={profileData}
					/>
					<MenuTweetsProfile />
					<div className="content__options" style={{ marginLeft: '10px' }}>
						<div className="home__tweetsList">
							{Array.isArray(posts) && posts.map((post) => {
								return <TweetPost key={userID} post={post} owner={appContext?.user.userID === post.userID} />
							})}
						</div>
					</div>
				</>
			}
		</div>
	)
}

export default Profile

