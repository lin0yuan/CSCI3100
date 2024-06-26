/**
 * Explore.js
 *
 * Description: This file contains the Explore page component.
 * 
 * @returns {void}
 * 
 * Example Usage:
 * <Explore />
 */

import { useState, useEffect } from 'react'
import NavExplore from '../../Components/NavPages/NavExplore/NavExplore'
import TweetPost from '../../Components/Tweet/TweetPost/TweetPost'
import './Explore.scss'

const Explore = () => {
	const [postData, setPostData] = useState(null)
	useEffect(() => {
        	fetch('http://localhost:3001/listpost')
            	.then((response) => {
                	if (!response.ok) {
                    	  throw new Error('Network response was not ok')
                	}
                	return response.json()
            	})
            	.then((data) => {
                	const shuffledData = sortByCoupon(data)
                	setPostData(shuffledData)
                	//console.log('here is test',data)
            	})
            	.catch((error) => {
               		console.error('Error fetching user data:', error)
            	})
      	}, [])
	const sortByCoupon = (array) => {
		return array.sort((a, b) => b.dislike - a.dislike)
	}
		
	return (
		<div className="explore__container">
			<NavExplore />
			<div className="explore__tweetsList">
				{postData?.map((post) => {
					return <TweetPost key={post.postID} post={post} />
				})}
			</div>
		</div>
	)
}


export default Explore