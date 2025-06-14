import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import styled from 'styled-components';
import { Toaster, toast } from 'react-hot-toast';
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
import { getFetchTitleBrevis } from '../redux/slices/titlesSlice';
import { getFetchDesignBrevis } from '../redux/slices/designsSlice';
import { getFetchResourceName } from '../redux/slices/resourcesSlice';
import Btn from '../components/Btn/btn';
import { useContext } from 'react';
import { InstallerContext } from '../components/App/App';
import FilterForm from '../components/filterForm/FilterForm';
import { ENTITY_LINKS } from '../config/entities';

// const entitys = [
//   { index: 1, name: 'Титула', entity: 'title', url: '/api/titles' },
//   { index: 2, name: 'Документация', entity: 'design', url: '/api/designs' },
//   { index: 3, name: 'Ресурсы', entity: 'resource', url: '/api/resources' },
//   { index: 4, name: 'Факт', entity: 'fact', url: '/api/facts' },
// ];

export const MainAppContainer = styled.div`
  max-width: 1180px;
  width: 95%;
  margin: 0 auto;
`;

export const LimitSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  // flex-direction: column;
  p {
    margin: 0;
    font-size: 1em;
    font-weight: 700;
    padding: 0 1em;
  }
  @media (max-width: 424px) {
    p {
      font-size: 0.9em;
    }
  }
`;
const initParamConfig = {
  entityType: '',
  mode: '',
  entityId: null,
  valueId: null,
};

const EntityPage = ({ selectEntity = 1 }) => {
  // Состояние для новой странице сущности
  const { data, isEmpty, error, limit, page, isLoading } = useSelector(
    (state) => state.dynamicPagination
  );
  const [sort, setSort] = useState(selectEntity);
  const [filterSort, setFilterSort] = useState('all'); // Для сохранения активного выбранного фильтра
  const [filter, setFilter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Состояние для универсальной формы, для передачи в форму при открытие модального окна
  const [paramConfig, setParamConfig] = useState(initParamConfig);
  // Используем redux toolkit
  const dispatch = useDispatch();

  //  Константа для сохранения текущей ветки страницы
  const currentIndex = useMemo(() => {
    setFilterSort('all');
    return ENTITY_LINKS?.findIndex((enti) => enti.index === sort);
  }, [sort]);

  const controllerRef = useRef(null);

  useEffect(() => {
    setSort(selectEntity);
  }, [selectEntity]);

  // Загрузка данных по designs и resources при первичной загрузки страницы EntityPage
  useEffect(() => {
    dispatch(getFetchTitleBrevis());
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
        let paramObject = null;
        if (filterSort === 'all') {
          paramObject = {
            url: ENTITY_LINKS[currentIndex].url,
            limit,
            page,
            signal: controllerRef.current.signal,
          };
        } else if (filter) {
          paramObject = {
            url: ENTITY_LINKS[currentIndex].url,
            limit,
            page,
            filter: { ...filter },
            signal: controllerRef.current.signal,
          };
        } else {
          paramObject = null;
        }
        if (paramObject) dispatch(getFetchWithPagination(paramObject));
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Ошибка загрузки:', error);
        }
        console.log(error);
      } finally {
        controllerRef.current = null;
      }
    },
    [currentIndex, dispatch, limit, page, filter, filterSort]
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
      entityType: ENTITY_LINKS[currentIndex].entity,
      mode: 'create',
    });
    setIsModalOpen(true);
  };
  const handleClickEditBtn = ({ id, factId, valueId }) => {
    setParamConfig({
      entityType: ENTITY_LINKS[currentIndex].entity,
      mode: 'edit',
      entityId: id || factId,
      ...(valueId && { valueId }),
    });
    setIsModalOpen(true);
  };
  const handleClickDeleteBtn = ({ id, factId, valueId }) => {
    setParamConfig({
      entityType: ENTITY_LINKS[currentIndex].entity,
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
        <ViewMain
          data={data}
          isEmpty={isEmpty}
          sort={sort}
          setSort={setSort}
          isGridContainer={true}
          limit={limit}
          filter={filter}
          filterSort={filterSort}
          setFilterSort={setFilterSort}
          onChangeFilter={setFilter}
          entity={ENTITY_LINKS[currentIndex].entity}
          onClickCreateBtn={handleClickCreateBtn}
          onClickEditBtn={handleClickEditBtn}
          onClickDeleteBtn={handleClickDeleteBtn}
          isLoading={isLoading}
        />
        {isModalOpen && (
          <Modal onClose={handleModalClose}>
            <ModalContext>
              <UniversalEntityForm
                {...paramConfig}
                onClose={handleModalClose}
                onSuccess={() => handleModalClose(true)}
                onCancel={() => handleModalClose(false)}
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
  isLoading,
  isEmpty,
  limit,
  setSort,
  sort,
  filter,
  filterSort,
  setFilterSort,
  onChangeFilter,
  entity,
  onClickCreateBtn,
  onClickEditBtn,
  onClickDeleteBtn,
}) => {
  const {
    installer: { theme },
  } = useContext(InstallerContext);

  const { error } = useSelector((state) => state.dynamicPagination);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  useEffect(() => {
    error &&
      toast.error(`${error}`, { position: 'bottom-center', duration: 3000 });
  }, [error]);

  return (
    <div className={`entity_container ${theme}-theme__container`}>
      <div className={`section`}>
        <SortBtns
          onChangeSort={setSort}
          activeSort={sort}
          arrSort={ENTITY_LINKS}
        />
      </div>
      <div className={`separator ${theme}-theme__separator`}></div>
      {isLoading && (
        <div className="section section__center">
          <Loader />
        </div>
      )}
      {!isLoading && (
        <>
          <div className="section section__space-between">
            <div style={{ display: 'inline-flex', gap: '1em' }}>
              <div className="btn_round_wrapper visible">
                <Btn
                  icon={'fa fa-filter'}
                  btnClassName={'button_round blue'}
                  onClickBtn={() => {
                    setIsOpenFilter(!isOpenFilter);
                  }}
                />
              </div>
              <div className="btn_round_wrapper visible">
                <Btn
                  icon={'fa fa-plus'}
                  btnClassName={'button_round green-ok'}
                  onClickBtn={onClickCreateBtn}
                />
              </div>
            </div>
            {/* {error && <p>{error}</p>} */}
            <LimitSelectWrapper>
              <p>Лимит</p>
              <CustomSelect limit={limit} />
            </LimitSelectWrapper>
          </div>
          {!isEmpty && (
            <>
              <div
                className={`section section__center section__${
                  isOpenFilter ? 'visible' : 'hidden'
                }`}
                style={{
                  overflow: 'hidden',
                  maxHeight: isOpenFilter ? '500px' : '0',
                  transition: 'max-height 0.5s cubic-bezier(0.33, 1, 0.68, 1)',
                }}
              >
                <FilterForm
                  isOpenFilter={isOpenFilter}
                  entity={entity}
                  filterSort={filterSort}
                  setFilterSort={setFilterSort}
                  onChangeFilter={onChangeFilter}
                  onOpenFilter={setIsOpenFilter}
                />
              </div>
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
              <div className="section section__center">
                <PaginationBtns />
              </div>
              <Toaster />
            </>
          )}
          {isEmpty && (
            <div className="entity_section">
              <p>Нет данных</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const View = ({ titles }) => {
  return (
    <>
      <h1>Выберите объект для внесения факта</h1>
      <CardsList cardsList={titles} entity={'title'} isGridContainer={true} />
    </>
  );
};

export default EntityPage;
