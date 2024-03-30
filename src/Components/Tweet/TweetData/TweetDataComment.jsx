import useGetPostTime from '../../../Hooks/useGetPostTime'

import ImagePosted from '../../../shared/Components/ImagePosted/ImagePosted'
import PhotoUser from '../../../shared/Components/PhotoUser/PhotoUser'
import SettingsMenu from '../../../shared/Components/SettingsMenu/SettingsMenu'

const TweetDataComment = ({
	post: {
		id,
		_id,
		user_photo,
		nameUser,
		username,
		postTime,
		text_posted,
		media_posted
	}
}) => {
	return (
		<div className="tweet__linkContainer">
			<div className="tweet__linkContent link">
				<div className="tweet__container-tweetData" >
					<div className="tweet__container-photo">
						<PhotoUser url={user_photo} />
					</div>
					<div className="tweet__container-content">
						<div className="content__nav">
							<div className="content__nav-data">
								<span className="nav__data-name">{nameUser}</span>
								<span className="nav__data-username">{username}</span>
								<span className="nav__data-time">· {useGetPostTime(postTime)}</span>
							</div>
						</div>
						<div className="content__text">
							{text_posted}
						</div>
						<div className="content__media">
							{media_posted && <ImagePosted url={media_posted} />}
						</div>
					</div>
				</div>
			</div>
			<div className="content__nav-settings">
				<SettingsMenu />
			</div>
		</div>
	)
}

export default TweetDataComment