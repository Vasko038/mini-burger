import styled from "@emotion/styled";
import {
  Divider as AntdDivider,
  Card as AntCard,
  Col,
  Row,
  Typography,
  Button,
  Pagination,
  Tag,
  RadioChangeEvent,
  Form,
  Radio,
  Input,
  Space,
  Empty,
} from "antd";
import { useEffect, useRef, useState } from "react";
import ScuterImg from "../../assets/scuter24x.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Modal from "../../components/Modal";
import { IoClose } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import DonutImg from "../../assets/donut.svg";
import OrderQuantity from "../../components/OrderQuantity ";
import Card from "../../components/Card";
import axios from "axios";
import { updateProducts } from "../../store/slices/ProductReducer";
const { Title, Paragraph, Text } = Typography;
const Divider = styled(AntdDivider)`
  margin-block: 3px !important;
`;
function Main() {
  const [basket, setBasket] = useState(false);
  const products = useSelector((state: RootState) => state.products.data);
  const categroies = useSelector((state: RootState) => state.categories.data);
  const basketRef = useRef<HTMLDivElement>(null);
  const mode = localStorage.getItem("mode");
  const [formRadio, setFormRadio] = useState(1);
  const [productId, setProductId] = useState<string | null>(null);
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isOrderModal = searchParams.get("order") === "true";
  const dispatch = useDispatch();
  const categorySlug = params.category;
  const category = categroies.find((item) => item.slug === categorySlug)?.id;
  const userBasket = useSelector((state: RootState) => state.basket.data);
  const formRadioOnChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setFormRadio(e.target.value);
  };
  const handleBasket = () => {
    setBasket(true);
  };
  const product = products.find((item) => item.id === productId);

  const handleClickOutside = (e: MouseEvent) => {
    if (basketRef.current && !basketRef.current.contains(e.target as Node)) {
      setBasket(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    async function fetchData() {
      try {
        if (category) {
          const res = await axios.get(
            `https://d54757447b9c0307.mokky.dev/products?categoryId=${category}`
          );
          if (res.status === 200) {
            dispatch(updateProducts(res.data));
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (categroies.length > 0) {
      fetchData();
    }
  }, [category]);
 useEffect(()=>{
    
 },[])
  return (
    <>
      <main className="container !z-50 px-[10px] md:px-[15px] lg:px-5  py-5 grid gap-5 mx-auto">
        <Row gutter={{ xs: 8, sm: 9, md: 10, lg: 20 }}>
          <Col span={24} sm={8} md={8} lg={6}>
            <div className="relative md:mt-[45px] z-30  sm:!sticky !top-[10px] h-[55px]">
              <AntCard
                onClick={handleBasket}
                ref={basketRef}
                className={`cursor-pointer transition-all w-full ${
                  basket
                    ? " w-full sm:w-[150%]   shadow-2xl md:shadow-none"
                    : ""
                }  !absolute !top-0   md:cursor-default md:w-auto sm:!sticky  md:h-auto  md:!sticky md:!top-0 p-3 !rounded-2xl mb-2 sm:mb-[4.5px] md:mb-[5px] lg:mb-[10px]`}
              >
                <div className="flex items-center justify-between mb-0 md:mb-3">
                  <Title className="!text-sm !mb-0 md:!text-xl lg:!text-2xl ">
                    Корзина
                  </Title>
                  <Tag
                    className={`!border-none ${
                      mode === "light" ? "bg-thridColor" : ""
                    } px-3 !m-0`}
                  >
                    0
                  </Tag>
                </div>

                {userBasket &&
                userBasket.products &&
                userBasket.products.length !== 0 ? (
                  <div className={`${basket ? "block " : "hidden md:block "} `}>
                    <Divider />
                    <Paragraph>{"Тут пока пусто :("}</Paragraph>
                    <div className="flex justify-between mb-3">
                      <Text>Итого</Text>
                      <Text>1279₽</Text>
                    </div>
                    <Button
                      onClick={() => setSearchParams({ order: "true" })}
                      size="large"
                      className={`w-full mb-2  text-white bg-secondColor !rounded-xl`}
                    >
                      Оформить заказ
                    </Button>
                    <div className="flex items-center gap-3">
                      <img src={ScuterImg} alt="" />
                      <Text className="text-xs">Бесплатная доставка</Text>
                    </div>
                  </div>
                ) : (
                  <Text className="hidden md:block">{"Тут пока пусто :("}</Text>
                )}
              </AntCard>
            </div>
          </Col>
          <Col span={24} sm={24} md={16} lg={18}>
            <Col span={12} sm={8} lg={8} md={12}>
              <Title level={3} className="!-z-30">
                {categorySlug
                  ? categorySlug[0].toUpperCase() + categorySlug.slice(1)
                  : "undef"}
              </Title>
            </Col>
            <Row gutter={{ xs: 8, sm: 9, md: 10, lg: 20 }}>
              {products.length !== 0 ? (
                products.map((item, index) => (
                  <Col key={index} span={12} sm={8} lg={8} md={12}>
                    <Card
                      onClick={() => {
                        setProductId(item.id);
                        navigate(
                          `category/${params.category}/${item.title
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`
                        );
                      }}
                      item={item}
                    />
                  </Col>
                ))
              ) : (
                <div className="flex justify-center items-center w-full sm:h-[318px] md:h-[352px] h-[284px]">
                  <Empty />
                </div>
              )}
            </Row>
          </Col>
        </Row>
        <Pagination align="center" defaultCurrent={1} total={50} />
      </main>
      <Modal open={!!params.product}>
        <div className="flex flex-col flex-grow h-full p-4">
          <div className="flex justify-between mb-3">
            <Typography.Title level={3} className="!mb-0">
              Modal Title
            </Typography.Title>
            <button
              className="text-2xl text-slate-500 modal-close"
              onClick={() => navigate(-1)}
            >
              <IoClose />
            </button>
          </div>
          <div className="flex flex-col justify-between h-full gap-5">
            <div className="flex flex-col justify-between gap-3 mb-7 sm:flex-row">
              <div className="w-full sm:w-[45%]">
                <img className="rounded-xl" src={product?.image} alt="" />
              </div>
              <div className="w-full sm:w-[55%]">
                <Paragraph className="text-md sm:text-sm md:text-md lg:text-lg">
                  {product?.desc}
                </Paragraph>
                <Paragraph>Состав:</Paragraph>
                <ul>
                  {product?.compound.map((item) => (
                    <li>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                size="large"
                className="text-white w-[75%] sm:w-[45%] bg-secondColor rounded-xl "
              >
                Добавить
              </Button>
              <div className="flex justify-end sm:items-center flex-col sm:flex-row w-[25%]  sm:w-[55%]  sm:justify-between">
                <OrderQuantity />
                <Title level={3} className="!mb-0 text-right sm:text-left">
                  689₽
                </Title>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal open={isOrderModal}>
        <div className="h-full md:grid md:grid-cols-2">
          <div className="items-center justify-center hidden p-4 md:flex bg-mainColor">
            <img className="w-full" src={DonutImg} alt="" />
          </div>
          <div className="flex flex-col justify-between h-full p-4">
            <div>
              <div className="flex justify-between mb-4">
                <Typography.Title level={3} className="!mb-0">
                  Modal Title
                </Typography.Title>
                <button
                  className="text-2xl text-slate-500 modal-close"
                  onClick={() => navigate(-1)}
                >
                  <IoClose />
                </button>
              </div>
              <Form className="mb-3">
                <Form.Item>
                  <Input size="large" placeholder="Второй телефон" />
                </Form.Item>
                <Radio.Group
                  className="mb-5"
                  onChange={formRadioOnChange}
                  value={formRadio}
                >
                  <Space direction="vertical">
                    <Radio value={1}>Самовывоз</Radio>
                    <Radio value={2}>Доставка на мой адрес</Radio>
                    <Radio value={3}>Доставка в другое место</Radio>
                  </Space>
                </Radio.Group>
                {formRadio === 3 && (
                  <>
                    <Form.Item>
                      <Input size="large" placeholder="Улица, дом, квартира" />
                    </Form.Item>
                    <Form.Item>
                      <Space.Compact className="!w-full">
                        <Input
                          placeholder="Адрес на карте"
                          size="large"
                          defaultValue="Combine input and button"
                        />
                        <Button size="large" type="primary">
                          <FaLocationDot />
                        </Button>
                      </Space.Compact>
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item>
                        <Input size="large" placeholder="Этаж" />
                      </Form.Item>
                      <Form.Item>
                        <Input size="large" placeholder="Домофон" />
                      </Form.Item>
                    </div>
                  </>
                )}
              </Form>
            </div>

            <Button size="large" className="w-full text-white bg-secondColor">
              Оформить
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Main;
