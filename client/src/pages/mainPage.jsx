import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import styled from 'styled-components';
import CardsList from '../components/cardsList/CardsList';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/loader/Loader';
import '../components/entityProfile/style.scss';
import SortBtns from '../components/sortBtns/SortBtns';
import CustomSelect from '../components/customSelect/CustomSelect';
import PaginationBtns from '../components/paginationBtns/PaginationBtns';
import {
  getFetchWithPagination,
  resetPagination,
} from '../redux/slices/dynamicPaginationSlice';
import Modal from '../components/modal/Modal';
import { ModalContext } from '../components/authForm/AuthForm';
import UniversalEntityForm from '../components/universalEntityForm/UniversalEntityForm';
import { getFetchDesignBrevis } from '../redux/slices/designsSlice';
import { getFetchResourceName } from '../redux/slices/resourcesSlice';
import Btn from '../components/Btn/btn';
import { useContext } from 'react';
import { InstallerContext } from '../components/App/App';

const entitys = [
  { index: 1, name: 'Титула', entity: 'title', url: '/api/titles' },
  { index: 2, name: 'Документация', entity: 'design', url: '/api/designs' },
  { index: 3, name: 'Ресурсы', entity: 'resource', url: '/api/resources' },
  { index: 4, name: 'Факт', entity: 'fact', url: '/api/facts' },
];

export const MainAppContainer = styled.div`
  max-width: 1180px;
  width: 95%;
  margin: 0 auto;
`;

export const LimitSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  p {
    margin: 0;
    font-size: 1em;
    font-weight: 700;
    color: #21005d;
  }
  @media (max-width: 424px) {
    p {
      font-size: 0.8em;
    }
  }
`;
const initParamConfig = {
  entityType: '',
  mode: '',
  entityId: null,
  valueId: null,
};

const MainPage = () => {
  // Состояние для новой главной странице
  const { data, isEmpty, limit, page, isLoading } = useSelector(
    (state) => state.dynamicPagination
  );
  const [sort, setSort] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Состояние для универсальной формы, для передачи в форму при открытие модального окна
  const [paramConfig, setParamConfig] = useState(initParamConfig);
  // Используем redux toolkit
  const dispatch = useDispatch();

  //  Константа для сохранения текущей ветки страницы
  const currentIndex = useMemo(() => {
    return entitys?.findIndex((enti) => enti.index === sort);
  }, [sort]);

  const controllerRef = useRef(null);

  // Загрузка данных по designs и resources при первичной загрузки страницы MainPage
  useEffect(() => {
    dispatch(getFetchDesignBrevis());
    dispatch(getFetchResourceName());
  }, []);
  // При изменении вкладки отображения будем сбрасывать page на 1 страницу
  useEffect(() => {
    dispatch(resetPagination());
  }, [sort]);

  const fetchData = useCallback(
    async (signal) => {
      try {
        if (controllerRef.current) {
          controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
        dispatch(
          getFetchWithPagination({
            url: entitys[currentIndex].url,
            limit,
            page,
            signal: controllerRef.current.signal,
          })
        );
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Ошибка загрузки:', error);
        }
      } finally {
        controllerRef.current = null;
      }
    },
    [currentIndex, dispatch, limit, page]
  );

  useEffect(() => {
    if (currentIndex === -1) return;
    fetchData();
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [fetchData, currentIndex]);

  const handleClickCreateBtn = () => {
    console.log('Нажал чтобы создать)');
    setParamConfig({
      entityType: entitys[currentIndex].entity,
      mode: 'create',
      // entityId: id || factId,
      // ...(valueId && { valueId }),
    });
    setIsModalOpen(true);
  };
  const handleClickEditBtn = ({ id, factId, valueId }) => {
    setParamConfig({
      entityType: entitys[currentIndex].entity,
      mode: 'edit',
      entityId: id || factId,
      ...(valueId && { valueId }),
    });
    setIsModalOpen(true);
  };
  const handleClickDeleteBtn = ({ id, factId, valueId }) => {
    setParamConfig({
      entityType: entitys[currentIndex].entity,
      mode: 'delete',
      entityId: id || factId,
      ...(valueId && { valueId }),
    });
    setIsModalOpen(true);
  };

  // Закрытие модального окна: создания, редактирования и удаления
  const handleModalClose = (shouldRefresh = false) => {
    setIsModalOpen(false);
    if (shouldRefresh) fetchData();
  };

  return (
    <>
      <MainAppContainer>
        {isLoading ? (
          <Loader />
        ) : (
          <ViewMain
            data={data}
            isEmpty={isEmpty}
            sort={sort}
            setSort={setSort}
            isGridContainer={true}
            limit={limit}
            entity={entitys[currentIndex].entity}
            onClickCreateBtn={handleClickCreateBtn}
            onClickEditBtn={handleClickEditBtn}
            onClickDeleteBtn={handleClickDeleteBtn}
          />
        )}
        {isModalOpen && (
          <Modal onClose={handleModalClose}>
            <ModalContext>
              <UniversalEntityForm
                {...paramConfig}
                onClose={handleModalClose}
                onSuccess={() => handleModalClose(true)}
                onCancel={() => handleModalClose(false)}
                // onSuccess={setIsSuccess}
              />
            </ModalContext>
          </Modal>
        )}
      </MainAppContainer>
    </>
  );
};

const ViewMain = ({
  data,
  isEmpty,
  limit,
  setSort,
  sort,
  entity,
  onClickCreateBtn,
  onClickEditBtn,
  onClickDeleteBtn,
}) => {
  const {
    installer: { theme },
  } = useContext(InstallerContext);
  // console.log(data);
  return (
    <div className={`entity_container ${theme}-theme__container`}>
      <div className={`entity_section ${theme}-theme__section`}>
        {/* <h1>Это главная страница программы</h1> */}
        <SortBtns onChangeSort={setSort} activeSort={sort} arrSort={entitys} />
        <LimitSelectWrapper>
          <p>Лимит</p>
          <CustomSelect limit={limit} />
        </LimitSelectWrapper>
      </div>

      <div className={`separator ${theme}-theme__separator`}></div>
      <div className="section">
        <div
          className="btn_round_wrapper visible"
          style={{ paddingBottom: '1em' }}
        >
          <Btn
            icon={'fa fa-plus'}
            btnClassName={'button_round green-ok'}
            onClickBtn={onClickCreateBtn}
          />
        </div>
      </div>
      {!isEmpty && (
        <>
          <div
            className={`entity_section entity_section__max-height ${theme}-theme__section`}
          >
            <CardsList
              cardsList={data}
              entity={entity}
              isGridContainer={false}
              onClickEditBtn={onClickEditBtn}
              onClickDeleteBtn={onClickDeleteBtn}
            />
          </div>
          <div className="section">
            <PaginationBtns />
          </div>
        </>
      )}
      {isEmpty && (
        <div className="entity_section">
          <p>Нет данных</p>
        </div>
      )}
    </div>
  );
};

// onChange={onChange}

const View = ({ titles }) => {
  return (
    <>
      <h1>Выберите объект для внесения факта</h1>
      <CardsList cardsList={titles} entity={'title'} isGridContainer={true} />
    </>
  );
};

export default MainPage;
