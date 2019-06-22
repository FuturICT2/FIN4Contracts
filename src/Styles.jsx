import styled from 'styled-components';
import colors from './config/colors-config';

const Container = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
	align-items: flex-start;

	> * {
		padding: 1em;
		margin: 10px;
		width: 400px;
		opacity: .9;
	}

	h3 {
		text-align: center;
		color: ${colors.main};
	}
`

export default Container;