import styled from 'styled-components';
import { ReactComponent as BarcodeImage } from '../../images/barcode.svg';

const Image = styled(BarcodeImage)`
  width: 170px;
  height: 60px;
`;

export const Barcode = () => {
  return <Image />;
};
Barcode.displayName = 'Barcode';
