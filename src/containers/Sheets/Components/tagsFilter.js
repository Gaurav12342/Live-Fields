import { OverlayTrigger } from 'react-bootstrap';
import React from 'react';
import CustomSelect from '../../../components/SelectBox';
import { getSiteLanguageData } from '../../../commons';

function TagsFilter({ allTags, tagsFilter, setTagsFilter, ...props }) {
	const { filter_by_tags } = getSiteLanguageData('sheet/components/tagsfilter');
	return (
		<>
			<OverlayTrigger
				trigger="click"
				placement="bottom-start"
				rootClose={true}
				overlay={
					<div
						style={{
							zIndex: '9999',
							width: '300px',
							maxHeight: '300px',
							background: 'white',
						}}
						className="p-2 border">
						<div className="row p-3 ">
							<CustomSelect
								isClearable
								isMulti
								type="Creatable"
								className="mb-1"
								placeholder="Filter by Tag..."
								name="tags"
								onChange={(e) => setTagsFilter(e?.map((t) => t.value))}
								value={tagsFilter.map((t) => {
									const tag = allTags?.filter((tt) => tt._id === t)[0];
									return {
										value: tag?._id,
										label: tag?.name,
									};
								})}
								options={allTags.map((tag) => {
									return {
										value: tag?._id,
										label: tag?.name,
									};
								})}
								closeMenuOnSelect={false}
							/>
						</div>
					</div>
				}>
				<span
					
					tooltip={`${filter_by_tags?.text} ${tagsFilter.length > 0 ? `(${tagsFilter.length})` : ''}`} 
					flow={`down`}
					className={
						tagsFilter.length > 0
							? 'lf-common-btn px-0 px-md-2 d-inline-block text-nowrap selected-filter'
							: `lf-common-btn`
					}>
					<i className="fas fa-filter lf-all-icon-size" />
					{` `}
					{filter_by_tags?.text}
					{tagsFilter.length > 0 ? `(${tagsFilter.length})` : ''}
				</span>
			</OverlayTrigger>
		</>
	);
}
export default TagsFilter;
