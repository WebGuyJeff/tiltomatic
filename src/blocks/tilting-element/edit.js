import { __ } from '@wordpress/i18n'
import { PropTypes } from 'prop-types'
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor'
import { useEffect } from "@wordpress/element"

export default function Edit( { context, attributes, setAttributes } ) {

	const {
		isolatedPerspective,
		perspective
	} = attributes

	useEffect( () => {
		setAttributes( { 
			isolatedPerspective: context[ 'tiltomatic/isolated-perspective' ],
			perspective: context[ 'tiltomatic/perspective' ]
		} )
	}, [ context ] ) // useEffect only runs if this dependency changes.

	const Tilt = () => {
	
		// We need to add an additional wrapper to assign perspective to when isolation is enabled.
		if ( isolatedPerspective ) {
			const blockProps = useBlockProps( {
				className: 'tilt_perspective',
				style: { perspective: perspective }
			} )

			return(
				<div { ...blockProps }>
					<div className="tilt">
						<InnerBlocks />
					</div>
				</div>
			)
			
		} else {
			const blockProps = useBlockProps( {
				className: 'tilt'
			} )

			return(
				<div { ...blockProps }>
					<InnerBlocks />
				</div>
			)
		}
	}

	return (
		<Tilt>
			<InnerBlocks />
		</Tilt>
	)
}

Edit.propTypes = {
    context: PropTypes.object.isRequired,
	attributes: PropTypes.object.isRequired,
	setAttributes: PropTypes.func.isRequired,
}
