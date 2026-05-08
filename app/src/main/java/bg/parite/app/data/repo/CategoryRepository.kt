package bg.parite.app.data.repo

import bg.parite.app.data.db.CategoryDao
import bg.parite.app.data.model.Category
import bg.parite.app.data.model.CategoryKind
import kotlinx.coroutines.flow.Flow

class CategoryRepository(private val dao: CategoryDao) {
    fun observeByKind(kind: CategoryKind): Flow<List<Category>> = dao.observeByKind(kind)
    fun observeAll(): Flow<List<Category>> = dao.observeAll()
    suspend fun byId(id: Long) = dao.byId(id)
    suspend fun insert(category: Category): Long = dao.insert(category)
    suspend fun update(category: Category) = dao.update(category)
}
