import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const {
    data: sales,
    isLoading: salesLoading,
  } = useGetTotalSalesQuery();

  const {
    data: customers,
    isLoading: customersLoading,
  } = useGetUsersQuery();

  const {
    data: orders,
    isLoading: ordersLoading,
  } = useGetTotalOrdersQuery();

  const {
    data: salesDetail,
    isLoading: salesDetailLoading,
  } = useGetTotalSalesByDateQuery();

  const [chartState, setChartState] = useState({
    options: {
      chart: {
        type: "bar",
        toolbar: {
          show: false,
        },
      },

      tooltip: {
        theme: "dark",
      },

      colors: ["#00E396"],

      dataLabels: {
        enabled: false,
      },

      stroke: {
        curve: "smooth",
      },

      title: {
        text: "Sales Trend",
        align: "left",
        style: {
          color: "#ffffff",
          fontSize: "18px",
        },
      },

      grid: {
        borderColor: "#333",
      },

      markers: {
        size: 4,
      },

      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: {
            color: "#ffffff",
          },
        },

        labels: {
          style: {
            colors: "#ffffff",
          },
        },
      },

      yaxis: {
        title: {
          text: "Sales",
          style: {
            color: "#ffffff",
          },
        },

        min: 0,

        labels: {
          style: {
            colors: "#ffffff",
          },
        },
      },

      legend: {
        position: "top",
        horizontalAlign: "right",
      },
    },

    series: [
      {
        name: "Sales",
        data: [],
      },
    ],
  });

  useEffect(() => {
    if (!salesDetail) return;

    const formattedSalesDate = salesDetail.map((item) => ({
      x: item._id,
      y: item.totalSales,
    }));

    setChartState((previous) => ({
      ...previous,

      options: {
        ...previous.options,

        xaxis: {
          ...previous.options.xaxis,

          categories: formattedSalesDate.map(
            (item) => item.x
          ),
        },
      },

      series: [
        {
          name: "Sales",

          data: formattedSalesDate.map(
            (item) => item.y
          ),
        },
      ],
    }));
  }, [salesDetail]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* ADMIN MENU */}

      <AdminMenu />

      {/* MAIN CONTENT */}

      <main className="w-full px-4 pb-10 pt-20 sm:px-6 lg:px-8 xl:pl-24">

        <div className="mx-auto w-full max-w-7xl">

          {/* PAGE TITLE */}

          <div className="mb-8">
            <h1 className="text-2xl font-bold sm:text-3xl">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Overview of your store
            </p>
          </div>


          {/* STATISTICS */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* SALES */}

            <div className="rounded-xl bg-black p-5 shadow-lg">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-xl font-bold">
                  $
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Total Sales
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {salesLoading ? (
                      <Loader />
                    ) : (
                      `$ ${
                        sales?.totalSales?.toFixed(2) || "0.00"
                      }`
                    )}
                  </h2>
                </div>

              </div>

            </div>


            {/* CUSTOMERS */}

            <div className="rounded-xl bg-black p-5 shadow-lg">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-xl font-bold">
                  U
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Customers
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {customersLoading ? (
                      <Loader />
                    ) : (
                      customers?.length || 0
                    )}
                  </h2>
                </div>

              </div>

            </div>


            {/* ORDERS */}

            <div className="rounded-xl bg-black p-5 shadow-lg">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-xl font-bold">
                  #
                </div>

                <div>
                  <p className="text-sm text-gray-400">
                    Total Orders
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    {ordersLoading ? (
                      <Loader />
                    ) : (
                      orders?.totalOrders || 0
                    )}
                  </h2>
                </div>

              </div>

            </div>

          </div>


          {/* SALES CHART */}

          <div className="mt-8 rounded-xl bg-black p-4 shadow-lg sm:p-6">

            <div className="mb-4">

              <h2 className="text-lg font-semibold sm:text-xl">
                Sales Analytics
              </h2>

              <p className="text-sm text-gray-400">
                Sales performance over time
              </p>

            </div>

            <div className="w-full overflow-x-auto">

              {salesDetailLoading ? (
                <div className="flex min-h-[300px] items-center justify-center">
                  <Loader />
                </div>
              ) : (
                <div className="min-w-[600px]">
                  <Chart
                    options={chartState.options}
                    series={chartState.series}
                    type="bar"
                    height={400}
                    width="100%"
                  />
                </div>
              )}

            </div>

          </div>


          {/* ORDERS */}

          <div className="mt-8 rounded-xl bg-black p-4 shadow-lg sm:p-6">

            <h2 className="mb-5 text-lg font-semibold sm:text-xl">
              Recent Orders
            </h2>

            <div className="w-full overflow-x-auto">
              <OrderList />
            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;