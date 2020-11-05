import React from 'react'
import PropTypes from 'prop-types'
import SpaceContainer from 'co/bookmarks/items'
import { connect } from 'react-redux'

import { Buttons, Button, Title } from 'co/navigation/header'
import SpaceTitle from './title'

class SpaceScreen extends React.Component {
	static propTypes = {
		route:  PropTypes.shape({
            params: PropTypes.shape({
				spaceId: PropTypes.number
			})
		})
	}
	
	componentDidMount() {
		this.loadSpace()

		this._focus = this.props.navigation.addListener('focus', () => {
			this.props.setLastCollection(this.props.route.params.spaceId)
		})
	}

	componentWillUnmount() {
		this._focus && this._focus()
	}

	componentDidUpdate(prevProps) {
		if (prevProps.route.params.spaceId != this.props.route.params.spaceId)
			this.loadSpace()
	}

	loadSpace = ()=>{
		this.props.loadBookmarks(this.props.route.params.spaceId, { sort: this.props.default_sort })
	}

	onSystemDrop = (data)=>{
		this.props.navigation.navigate('bookmark', {
			screen: 'add',
			params: {
				...data,
				collectionId: parseInt(this.props.route.params.spaceId)
			}
		})
	}

	onShareTap = ()=>
		this.props.navigation.navigate('collection', {
			screen: 'sharing/list',
			params: { _id: this.props.route.params.spaceId }
		})

	onMoreTap = ()=>
		this.props.navigation.navigate('collection', { _id: this.props.route.params.spaceId })

	render() {
		const { route: { params={} } } = this.props

		return (
			<>
				<Title spaceId={params.spaceId}>
					<SpaceTitle spaceId={params.spaceId} />
				</Title>

				<Buttons spaceId={params.spaceId}>
					{params.spaceId > 0 && (
						<Button icon='account-circle' onPress={this.onShareTap} />
					)}

					<Button icon='search' onPress={()=>this.props.navigation.navigate('search', { spaceId: params.spaceId })} />

					<Button icon='more-2' onPress={this.onMoreTap} />
				</Buttons>

				<SpaceContainer 
					key={params.spaceId}
					spaceId={params.spaceId}
					onSystemDrop={this.onSystemDrop} />
			</>
		)
	}
}

export default connect(
	state=>({
		default_sort: state.config.raindrops_sort
	}),
	{
		loadBookmarks: require('data/actions/bookmarks').load,
		setLastCollection: require('data/actions/config').setLastCollection
	}
)(SpaceScreen)