import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../config";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    count: 0,
  });

  useEffect(() => {
    fetchCoupons(1);
  }, [debouncedSearch, filterType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const buildQueryParams = (page) => {
    const trimmedSearch = debouncedSearch.trim();
    const params = { page };

    if (trimmedSearch) {
      // Send common search keys to support backend implementations with different param names.
      params.search = trimmedSearch;
      params.keyword = trimmedSearch;
      params.query = trimmedSearch;
      params.q = trimmedSearch;

      if (pagination.total > 0) {
        params.count = pagination.total;
        params.limit = pagination.total;
      }
    }

    if (filterType !== "all") {
      params.type = filterType;
    }

    return params;
  };

  const fetchCoupons = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/admin/coupons`, {
        params: buildQueryParams(page),
      });

      setCoupons(response.data?.data || []);
      setPagination({
        page: response.data?.page || page,
        totalPages: response.data?.totalPages || 1,
        total: response.data?.total || 0,
        count: response.data?.count || 0,
      });
    } catch (error) {
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await axios.delete(`${API_URL}/api/admin/coupons/${id}`);
      toast.success("Coupon deleted successfully");

      const shouldGoPreviousPage = coupons.length === 1 && pagination.page > 1;
      const nextPage = shouldGoPreviousPage
        ? pagination.page - 1
        : pagination.page;
      fetchCoupons(nextPage);
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  const handlePageChange = (nextPage) => {
    if (
      nextPage < 1 ||
      nextPage > pagination.totalPages ||
      nextPage === pagination.page
    )
      return;
    fetchCoupons(nextPage);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Coupons Management</h1>
        <Link
          to="/admin/coupons/new"
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
        >
          + Add New Coupon
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search coupons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-md h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="all">All Types</option>
          <option value="Code">Code</option>
          <option value="Deal">Deal</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                Store
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                Code
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                Discount
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No coupons found
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {coupon.storeName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{coupon.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        coupon.type === "Code"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {coupon.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">
                    {coupon.code || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {coupon.discount || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        coupon.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/coupons/edit/${coupon._id}`}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(coupon._id, coupon.title)}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-gray-600">
            Page{" "}
            <span className="font-semibold text-gray-800">
              {pagination.page}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {pagination.totalPages}
            </span>{" "}
            | Showing{" "}
            <span className="font-semibold text-gray-800">
              {pagination.count}
            </span>{" "}
            coupons{" "}
            | Total coupons:{" "}
            <span className="font-semibold text-gray-800">
              {pagination.total}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg min-w-[90px] text-center">
              {pagination.page} / {pagination.totalPages}
            </span>

            <button
              type="button"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
