import { __ } from '@wordpress/i18n'
import { PropTypes } from 'prop-types'
import { PanelBody, RangeControl, CheckboxControl, SelectControl, TextControl } from '@wordpress/components'
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor'

import { initialise } from './tilting-elements-group-view'

export default function Edit( { attributes, setAttributes } ) {

	const {
		tiltRangeX,
		tiltRangeY,
		perspective,
		isolatedPerspective,
		enabled,
		overflowMode,
		overflowSelector
	} = attributes

	const containerClassName = 'tilt_container'

	const overflowModeSelectOptions = [
		{ value: 'container', label: 'Tilt Container' },
		{ value: 'custom', label: 'Custom (define below)' },
		{ value: 'disabled', label: 'Disabled' }
	]

	const overflowModeChange = ( newValue ) => {
		let selector = ''
		if ( newValue === 'container' ) {
			selector = '.' + containerClassName
		} else if ( newValue === 'custom' ) {
			selector = ( overflowSelector === '.' + containerClassName ) ? '' : overflowSelector
		}
		setAttributes( {
			overflowMode: newValue,
			overflowSelector: selector
		} )
	}

	const overflowSelectorConditionalProp = overflowSelector ? { 'data-overflow-selector': overflowSelector } : {}

	const perspectiveConditionalStyle = isolatedPerspective ? {} : { style: { perspective: perspective } }

	const blockProps = useBlockProps( {
		className: containerClassName,
		...perspectiveConditionalStyle
	} )

	/*
	 * Setup new blocks on insersion.
	 * initialise()
	 */

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
						checked={ enabled === 'true' || false }
						onChange={ ( newValue ) => setAttributes( { enabled: ( newValue ? 'true' : 'false' ) } ) }
						help={ __( 'Disable/enable the animation.', 'tiltomatic' ) }
					/>
					<SelectControl
						label={ __( 'Hide overflow mode', 'tiltomatic' ) }
						labelPosition="top"
						title={ __( 'Hide overflow mode', 'tiltomatic' ) }
						value={ overflowMode }
						options={ overflowModeSelectOptions }
						onChange={ ( newValue ) => overflowModeChange( newValue ) }
						help={ __( 'Choose handling of visual overflow. Hiding overflow on the tilt container is recommended. You can also specify a custom CSS selector or disable to keep all overflow visible.', 'tiltomatic' ) }
					/>
					{ overflowMode === 'custom' &&
						<TextControl
							label={ __( 'Hide overflow CSS selector', 'tiltomatic' ) }
							title={ __( 'Hide overflow CSS selector', 'tiltomatic' ) }
							value={ overflowSelector }
							onChange={ ( newValue ) => setAttributes( { overflowSelector: newValue } ) }
							help={ __( 'Target any wrapping element with a valid CSS selector to hide overflow on.', 'tiltomatic' ) }
						/>
					}
				</PanelBody>
			</InspectorControls>

			<div
				{ ...blockProps }
				{ ...overflowSelectorConditionalProp }
				data-tilt-range-x={ tiltRangeX }
				data-tilt-range-y={ tiltRangeY }
				data-tilt-enabled={ enabled }
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
