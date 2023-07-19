import styled from 'styled-components'
/* istanbul ignore file */

const Header = styled.header`
  font-weight: 700;
  font-size: 1.25rem;
`

export const QuestionHeader = ({ meta }: any) => {
  return <Header>{meta.label}</Header>
}
