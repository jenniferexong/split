import styled from 'styled-components';
import { ReactComponent as BarcodeImage } from '../../images/barcode.svg';

const Image = styled(BarcodeImage)`
  width: 200px;
  height: 70px;
`;

export const Barcode = () => {
  return <Image />;
};
