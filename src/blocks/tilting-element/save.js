import { useBlockProps, InnerBlocks } from '@wordpress/block-editor'
import { PropTypes } from 'prop-types'

export default function save( { attributes } ) {

	const {
		isolatedPerspective,
		perspective
	} = attributes

	const Tilt = () => {
	
		// We need to add an additional wrapper to assign perspective to when isolation is enabled.
		if ( isolatedPerspective ) {
			const blockProps = useBlockProps.save( {
				className: 'tilt_perspective',
				style: { perspective: perspective }
			} )

			return(
				<div { ...blockProps }>
					<div className="tilt">
						<InnerBlocks.Content />
					</div>
				</div>
			)
			
		} else {
			const blockProps = useBlockProps.save( {
				className: 'tilt'
			} )

			return(
				<div { ...blockProps }>
					<InnerBlocks.Content />
				</div>
			)
		}
	}

	return (
		<Tilt>
			<InnerBlocks.Content />
		</Tilt>
	)
}

save.propTypes = {
	attributes: PropTypes.object.isRequired
}
