import { __ } from '@wordpress/i18n'
import { PropTypes } from 'prop-types'
import { PanelBody, RangeControl, CheckboxControl, SelectControl } from '@wordpress/components'
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor'

import { initialise } from './tilting-elements-group-view'

export default function Edit( { attributes, setAttributes } ) {

	const {
		tiltRangeX,
		tiltRangeY,
		perspective,
		isolatedPerspective,
		enabled,
		overflowMode
	} = attributes

	const containerClassName = 'tilt_container'

	// Overflow target select control values.
	const overflowModeSelectOptions = [
		{ value: '.' + containerClassName, label: "Tilt Container" },
		{ value: 'body', label: "Document Body" },
		{ value: 'disabled', label: "Disabled" }
	]

	const blockProps = useBlockProps( {
		className: containerClassName,
		style: {
			perspective: perspective
		}
	} )

	// Setup new blocks on insersion.
	initialise()

	return (
		<>

			<InspectorControls>
				<PanelBody
					title={ __( 'Settings' ) }
					initialOpen={ true } 
				>
					<RangeControl
						label={ __( 'X-axis range', 'tiltomatic' ) }
						value={ parseInt( tiltRangeX ) }
						onChange={ ( newValue ) => setAttributes( { tiltRangeX: String( newValue ) } ) }
						max={ 90 }
						min={ 0 }
						help={ __( 'Set the X-axis rotational range in degrees.', 'tiltomatic' ) }
					/>
					<RangeControl
						label={ __( 'Y-axis range', 'tiltomatic' ) }
						value={ parseInt( tiltRangeY ) }
						onChange={ ( newValue ) => setAttributes( { tiltRangeY: String( newValue ) } ) }
						max={ 90 }
						min={ 0 }
						help={ __( 'Set the Y-axis rotational range in degrees.', 'tiltomatic' ) }
					/>
					<RangeControl
						label={ __( '3D perspective distance', 'tiltomatic' ) }
						value={ parseInt( perspective ) }
						onChange={ ( newValue ) => setAttributes( { perspective: newValue + 'px', } ) }
						max={ 1000 }
						min={ 0 }
						help={ __( 'Distance to the perspective vanishing point in pixels. Smaller values result in more noticeable perspective and movement.', 'tiltomatic' ) }
					/>
					<CheckboxControl
						label={ __( 'Isolated perspective', 'tiltomatic' ) }
						checked={ isolatedPerspective }
						onChange={ ( newValue ) => setAttributes( { isolatedPerspective: newValue } ) }
						help={ __( 'Wrap tilt elements in individual perspective containers.', 'tiltomatic' ) }
					/>
					<CheckboxControl
						label={ __( 'Animation enabled', 'tiltomatic' ) }
						checked={ enabled }
						onChange={ ( newValue ) => setAttributes( { enabled: newValue } ) }
						help={ __( 'Disable/enable the animation.', 'tiltomatic' ) }
					/>
					<SelectControl
						label={ __( 'Overflow mode', 'tiltomatic' ) }
						labelPosition="top"
						title="Hide-overflow mode"
						value={ overflowMode }
						options={ overflowModeSelectOptions }
						onChange={ ( newValue ) => setAttributes( { overflowMode: newValue } ) }
						help={ __( 'Select the container to hide any visual overflow outside of.', 'tiltomatic' ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div
				{ ...blockProps }
				data-tilt-range-x={ tiltRangeX }
				data-tilt-range-y={ tiltRangeY }
				data-overflow-mode={ overflowMode }
			>
				<InnerBlocks />
			</div>

		</>
	)
}

Edit.propTypes = {
	attributes: PropTypes.object,
	setAttributes: PropTypes.func
}
