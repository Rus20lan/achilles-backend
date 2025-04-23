import styled from "styled-components";
import Card from "../card/Card";

const CardsContainerGrid = styled.ul`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  list-style-type: none;
  padding-left: 0;
  row-gap: 1.5rem;
  column-gap: 1.5rem;
  :active {
    transform: scale(0.88);
  }
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 496px) {
    grid-template-columns: 1fr;
  }
`;
const CardsContainerLine = styled.ul`
  width: 100%;
  display: grid;
  grid-template-columns: auto;
  box-sizing: border-box;
  padding-left: 0;
  row-gap: 1.2em;
  list-style-type: none;
`;
const CardsList = ({ cardsList, entity, isGridContainer, onClickEditBtn }) => {
  return (
    <>
      {isGridContainer && (
        <CardsContainerGrid>
          {cardsList.map((card) => (
            <Card
              key={card.titleID}
              full_name={card.full_name}
              brevis={card.brevis}
              id={card.titleID}
              code={card.title_code}
              entity={entity}
              isGridContainer={isGridContainer}
            />
          ))}
        </CardsContainerGrid>
      )}
      {!isGridContainer && (
        <CardsContainerLine id="cards_container_line">
          {cardsList.map(({ id, titleID, factId, ...props }) => (
            <Card
              key={id ?? titleID ?? `${id}_${factId}`}
              id={id ?? titleID ?? factId}
              entity={entity}
              onClickEditBtn={onClickEditBtn}
              factId={factId}
              {...props}
            />
          ))}
        </CardsContainerLine>
      )}
    </>
  );
};

export default CardsList;
